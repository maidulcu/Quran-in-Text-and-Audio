(function () {

	function dynamicQuranApi(){

		let quranDynamicObj = {
			'api': 'https://api.alquran.cloud/v1',
		};
	
		quranDynamicObj.mainWrapper = document.querySelector(".dwl-quran-full-wrapper");
	
		if(!quranDynamicObj.mainWrapper){
			return;
		}


		async function getResponse(url = "") {
			const response = await fetch(url, {
				method: "GET"
			});
			return response.json();
		}
	
		function outputSingleAyah(data) {
	
			return `<div class="quran-surah-ayah--wrapper">
			<div class="quran-surah-ayah--meta">
			<div class="quran-surah-name--english">${data[0].surah.englishName}</div>
			<div class="quran-surah-ayah--number quran-text-arabic">${data[0].surah.number} : ${data[0].number} ${data[0].surah.name}</div>
			</div><!--.quran-surah-ayah--meta-->
			<div class="quran-surah-ayah--text quran-text-arabic">${data[0].text}</div><!--.quran-surah-ayah--text-->
			<div class="quran-surah-ayah--text">${data[1].text}</div><!--.quran-surah-ayah--text-->
			</div>`;
	
		}
	
	
		function showAllAyahs(data) {
	
			let html = '';
			if (data.length > 0) {
	
				html += `<div class="quran-surah-name--wrapper">
				<button class="dwl-surah-toggle"><span class="quran-surah-name--english">${data[0].englishName}</span><span><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.135 6.158a.5.5 0 0 1 .707-.023L7.5 9.565l3.658-3.43a.5.5 0 0 1 .684.73l-4 3.75a.5.5 0 0 1-.684 0l-4-3.75a.5.5 0 0 1-.023-.707Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></span></button>
				<h2 class="quran-surah-name--arabic quran-text-arabic">${data[0].name}</h2>
				</div>`;
	
				data[0].ayahs.forEach((item, index) => {
	
					html += `<div class="quran-surah-ayah--wrapper">
					<div class="quran-surah-ayah--meta">
					<div class="quran-surah-ayah-play" data-audio="https://cdn.islamic.network/quran/audio/128/ar.alafasy/${item.number}.mp3"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9V168c0-8.7 4.7-16.7 12.3-20.9z"/></svg></div>
					<div class="quran-surah-ayah--number quran-text-arabic">${data[0].number} : ${item.number}</div></div>
					<div class="quran-surah-ayah--text quran-text-arabic">
					<span class="quran-single-ayah">${item.text}</span>
					</div><!--.quran-surah-ayah--text-->
					<div class="quran-surah-ayah--text">
					<span class="quran-single-ayah">${data[1].ayahs[index].text}</span>
					</div><!--.quran-surah-ayah--text-->
					</div>`;
	
				});
			}
			return html;
		}
	
	
		function getSurahBySuahId(item, surahId = 1) {
	
			getResponse(quranDynamicObj.api + "/surah/" + surahId + "/editions/quran-uthmani,en.asad").then((response) => {
				//console.log(response);
	
				if (response.code == '200') {
	
					item.innerHTML = showAllAyahs(response.data);
	
				}
	
	
			});
	
	
	
		}
	
		/**
		 * Surah list
		 */
	
		function dwlSurahList(data) {
			let active = '';
			let html = '<ul class="dwl-surah-list">';
			data.forEach(function (item) {
				active = item.number == 1 ? ' active' : '';
				html += '<li><button id="dwl-surah-number-' + item.number + '" class="dwl-surah-name-btn' + active + '"  data-surah_number="' + item.number + '"><span class="dwl-surah--number">' + item.number + '</span><span class="dwl-surah--english-name">' + item.englishName + '</span><span class="dwl-surah--translation">' + item.englishNameTranslation + '</span></button></li>';
			});
			html += '</ul>';
	
			return html;
		}
	
		const dwlSurahWrapper = document.getElementById("dwl-surah-listing");
		if (dwlSurahWrapper) {
			getResponse(quranDynamicObj.api + "/surah").then(response => {
				//console.log(response);
				dwlSurahWrapper.innerHTML = dwlSurahList(response.data);
			});
		}
	
		/**
		 * Surah offcanvas toggle
		 */
		document.addEventListener("click", function (e) {
	
			//console.log(e.target.className);
	
			if (e.target.classList.contains('dwl-surah-name-btn')) {
				const offcanvasArea = document.getElementById('dwl-surah-offcanvas');
				//console.log(e.target);
				//console.log(quranDynamicObj.mainWrapper);
				const active = offcanvasArea.querySelectorAll('.dwl-surah-name-btn.active');
				const selected = offcanvasArea.querySelectorAll('#dwl-surah-number-' + e.target.dataset.surah_number);
				//console.log(selected);
				const targedSelected = quranDynamicObj.mainWrapper.querySelectorAll('.dwl-quran-surah.active');
				const targed = quranDynamicObj.mainWrapper.querySelectorAll('#dwl-quran-surah-' + e.target.dataset.surah_number);
				if (active) {
					//remove class
					active[0].classList.remove("active");
				}
				if (selected) {
					//remove class
					selected[0].classList.add("active");
				}
				if (targedSelected) {
					targedSelected[0].classList.remove("active");
				}
				if (targed) {
					//add class
					targed[0].classList.add("active");
				}
	
	
				getSurahBySuahId(targed[0], e.target.dataset.surah_number);
	
			}
	
	
			if (e.target.className == 'dwl-surah-toggle') {
				const offcanvasArea = document.getElementById('dwl-surah-offcanvas');
				offcanvasArea.classList.add('active-offcanvas');
			}
			if (e.target.className == 'dwl-surah-offcanvas-close') {
				const offcanvasArea = document.getElementById('dwl-surah-offcanvas');
				//console.log(e.target.className);
				offcanvasArea.classList.remove('active-offcanvas');
			}
	
			if (e.target.className == 'quran-surah-ayah-play') {
	
				let audio = document.getElementById("quran-audio-player");
	
				let audioSrc = e.target.dataset.audio;
	
				//console.log(audioSrc);
				audio.src = audioSrc;
	
				audio.onplaying = function () {
					isPlaying = true;
				};
				audio.onpause = function () {
					isPlaying = false;
				};
	
	
				isPlaying ? audio.pause() : audio.play();
	
	
			}
	
		});
	
	
		const dwlQuranSurahActive = document.querySelectorAll(".dwl-quran-surah.active");
	
		dwlQuranSurahActive.forEach((item) => {
			getSurahBySuahId(item, item.dataset.surah);
		});
	
		const dwlQuranSurahAyah = document.querySelectorAll(".dwl-quran-ayah-wrapper");
	
		dwlQuranSurahAyah.forEach((item) => {
			getResponse(quranDynamicObj.api + '/ayah/' + item.dataset.ayah + '/editions/quran-uthmani,en.asad').then(response => {
				//console.log(response);
				item.innerHTML = outputSingleAyah(response.data);
			});
		});

		
	}
	
	dynamicQuranApi();

})();
