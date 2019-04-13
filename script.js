class Saper {
	constructor(options) {
		this.saper = document.querySelector(options.saper);
		this.saperInfo = document.querySelector(options.saperInfo);
		this.saperField = document.querySelector(options.saperField);
		this.allSquareDown = options.saperFieldSquareDown;
		this.allSquare = options.saperFieldSquare;
		this.saperTime = options.saperTime;
		//Таймер, который будет включаться когда стартонет время. И очищаться для остановки времени.

		this.timer;

		this.init();
	}
	/*Метод инициализации, будет вызываться сразу в конструкторе */
	init() {
		this.renderFieldSquareUp();
		this.renderFieldSquareDown();
		this.allHandlersEvent();
		//Флаг, проверка запуска времени
		this.timeIsRunning = false;
	}
	/*Метод для добавления клеточек в поле */
	renderFieldSquareUp() {
		for(let i = 0; i < 200; i++) {
			let elem = document.createElement('div');
			
				elem.className = 'saper__field_square';
				elem.dataset.number = i;
				this.saperField.appendChild(elem);

		}
	}

	renderFieldSquareDown() {
		for(let i = 0; i < 200; i++) {
			let elem = document.createElement('div');
			
				elem.className = 'saper__field_square-down';
				elem.dataset.number = i;
				elem.append(document.createTextNode('0'));//Добавляю текст для последубщего добавления количества бомб вокруг клетки
				this.saperField.appendChild(elem);

		}
		this.addRandomBombs();
		this.renderCountAroundBombs();
		this.colorNumbers();
	}

	//Метод поиска всех клеточек для расстановки бомб

	getAllSquareDown (classes) {
		return document.querySelectorAll(classes);
	}

	// Все обработчики событий сдесь
	allHandlersEvent() {
		const self = this;
		const allSquareUp = this.getAllSquareDown(this.allSquare);
		const allSquareDown = this.getAllSquareDown(this.allSquareDown);
		/*Навешиваю на кнопку RESET */
		this.saperInfo.children[1].onmousedown = function() {
			this.classList.add('saper__info_reset-click');
			window.location.reload()
		}
		this.saperInfo.children[1].onmouseup = function() {
			this.classList.remove('saper__info_reset-click');
			
		}
		// Отеменяю выделение на поле

		this.saperField.onselectstart = onmousedown = () => {
			return false;
		}
		/*Обработчик клик на клеточки на поле */
		this.saperField.onclick = function(e) {
			//Если время уже запущено не запускать
			if(self.timeIsRunning == true) self.timeIsRunning = true;
			else self.startTime();
			// Применяю делегирование. Если нажати не на клеточку или на ней есть флаг, то ничего не делать
			let target = e.target;
			if(!target.classList.contains('saper__field_square') || target.classList.contains('flag')) return;
			// Иначе делаем верхнуюю клуточку прозрачной
			target.style.opacity = '0';

			//Если мы попали на бомбу, надо закончить игрую. Связью между верхними и нижними клеточками будет data-number

			if( window.getComputedStyle(allSquareDown[target.dataset.number]).backgroundImage != 'none') {
				allSquareDown[target.dataset.number].classList.add('explosion');
				self.opacityForAllSquareUp()
			}

			//Открываем поля без бомб вокруг
			console.log(target);
			self.checkAndOpenSquare(target);

		}
		
		
		/*Обработчик при нажатии на правую кнопку мыши. Устанавливает флажок */

		this.saperField.oncontextmenu = function(e) {
			e.preventDefault();//Отменяю дейсвия браузера по умолчанию
			let target = e.target;// Используем делегирование
			if(target.classList.contains('saper__field_square') && target.style.opacity === '0') return;// Если клеточка пустая не ставить флаг
			//Установка и снятие флага с неизвестной клеточки
			if(target.classList.contains('saper__field_square') && target.classList.contains('flag')){
				target.classList.remove('flag');
				self.saperInfo.children[0].innerHTML  = '0' + (+self.saperInfo.children[0].innerHTML + 1);
			}else {
				target.classList.add('flag');
				self.saperInfo.children[0].innerHTML  = '0' + (+self.saperInfo.children[0].innerHTML - 1);

			}
		}

	}

	/*Метод для рандомной расстановки бомб. К соответсвующей клеточки будет добавляться бомба как фон */ 
	addRandomBombs() {
		const allSquare = this.getAllSquareDown(this.allSquareDown);
		for(let i = 0; i < 50; i++) {
			allSquare[Math.floor((Math.random() * 100) * 2)].classList.add('bomb');
		}
		}	

		/*При клике на поле, начинается отсчет времени */
	startTime() {
		this.timeIsRunning = true;
		const saperTime = document.querySelector(this.saperTime);
		const innerArray = [0, 0, 0];
		
			if(innerArray.join('') === '999') {
				saperTime.innerHTML = '999';
				clearInterval(this.timer);
				
			}
			this.timer = setInterval(() => {
				
				saperTime.innerHTML = innerArray.join('');
				innerArray[2] += 1;
				if(innerArray[2] === 10) {
					innerArray[2] = 0;
					innerArray[1] += 1;
				}
				if(innerArray[1] === 10) {
					innerArray[1] = 0;
					innerArray[0] += 1
				} 
				
			}, 1000);

	}

	/* Метод для отслеживания бомб вокруг клеточки */

	renderCountAroundBombs () {
		const fieldSquare = this.getAllSquareDown(this.allSquareDown);
		var checkElem = [];
		var countBombs = 0;
			for(let i = 0; i < 200; i++) {

					//Для крайних и угловых клеточек будет свой масcив для проверки соседних клеточек
					if ( i == 0 ) {
						checkElem = [ i+1, i+20, i+21 ];
					}
					else if ( i == 180 ) checkElem = [ i+1, i-20, i-19 ];
					else if ( i == 19 ) checkElem = [ i-1, i+20, i+19 ];
					else if ( i == 19 ) checkElem = [ i-1, i+20, i+19 ];
					else if ( i == 199 ) checkElem = [ i-1, i-20, i-21 ];
					else if( i == 20 || i == 40 || i == 60 || i == 80 || i == 100 || i == 120 || i == 140 || i == 160 ) {
						checkElem = [ i+1, i-20, i+20, i+21, i-19 ]
					}
					else if( i == 19 || i == 39 || i == 59 || i == 79 || i == 99 || i == 119 || i == 139 || i == 159 || i == 179 ) {
						checkElem = [ i-1, i-20, i+20, i-21, i+19 ]
					}
					else if ( i >= 1 && i <= 18) {
						checkElem = [i+1, i-1, i+20, i+19, i+21]
					}
					else if ( i >= 181 && i <= 199) {
						checkElem = [i+1, i-1, i-20, i-19, i-21]
					}else {
						checkElem = [i-21, i-20, i-19, i+1, i+21, i+20, i+19, i-1];
					}

					

					 for(let j = 0; j < checkElem.length; j++) {
						if( window.getComputedStyle(fieldSquare[i]).backgroundImage != 'none') {
							fieldSquare[i].style.color = 'transparent';// Чтобы в клетке с бомбой не было цифры
						}
						const objStyle = window.getComputedStyle(fieldSquare[checkElem[j]]);
						if(objStyle.backgroundImage != 'none') {
							// console.log(objStyle);
							countBombs += 1;
							
							
						}
						fieldSquare[i].textContent = countBombs;
					
					 }
					 countBombs = 0;
				}
		
	}

	//Метод для для цвета цифр количетсва бомб
	colorNumbers() {
		const fieldSquare = this.getAllSquareDown(this.allSquareDown);
		console.log(fieldSquare[3]);
		
		for(let i = 0; i < fieldSquare.length; i++) {
			if(fieldSquare[i].innerHTML === '1' && fieldSquare[i].style.color != 'transparent' ) {
				fieldSquare[i].style.color = 'blue';
			} else if (fieldSquare[i].innerHTML === '2' && fieldSquare[i].style.color != 'transparent') {
				fieldSquare[i].style.color = 'green';
			} else if (fieldSquare[i].innerHTML === '3' && fieldSquare[i].style.color != 'transparent') {
				fieldSquare[i].style.color = 'red';
			} else if (fieldSquare[i].innerHTML === '4' && fieldSquare[i].style.color != 'transparent') {
				fieldSquare[i].style.color = '#040478';
			} else if (fieldSquare[i].innerHTML === '5' && fieldSquare[i].style.color != 'transparent') {
				fieldSquare[i].style.color = '#7B0000';
			} else if (fieldSquare[i].innerHTML === '6' && fieldSquare[i].style.color != 'transparent') {
				fieldSquare[i].style.color = '#017E6E';
			} else if (fieldSquare[i].innerHTML === '0' && fieldSquare[i].style.color != 'transparent') {
				fieldSquare[i].style.color = 'transparent';
			} else if (fieldSquare[i].innerHTML === '7' && fieldSquare[i].style.color != 'transparent') {
				fieldSquare[i].style.color = '#DD7D00';
			} 
			
		}	
	}
	//Если попал на бомбу, то вызыватется этот метод и game over
	opacityForAllSquareUp() {
		const allSquare = this.getAllSquareDown(this.allSquare);
		for(let i = 0; i < allSquare.length; i++) {
			allSquare[i].style.opacity = '0';
		}
		//Останавливаем время
		clearInterval(this.timer);
	}

	//Метод который при клике на пустую клетку, будет открывать соседние пустые клетки. Параметр - клетка по которой мы кликнули
	checkAndOpenSquare(target) {
		const allSquareDown = this.getAllSquareDown(this.allSquareDown);
		const allSquareUp = this.getAllSquareDown(this.allSquare);
		console.log(target);
		var target = target;
		console.log(target);
		/*Функция для открытия верних клеток для клетки */
		function openSquaresUp(i) {
				//Для крайних и угловых клеточек будет свой масcив для проверки соседних клеточек
				var checkElem = [];
				if ( i == 0 ) {
					checkElem = [ i+1, i+20, i+21 ];
				}
				else if ( i == 180 ) checkElem = [ i+1, i-20, i-19 ];
				else if ( i == 19 ) checkElem = [ i-1, i+20, i+19 ];
				else if ( i == 19 ) checkElem = [ i-1, i+20, i+19 ];
				else if ( i == 199 ) checkElem = [ i-1, i-20, i-21 ];
				else if( i == 20 || i == 40 || i == 60 || i == 80 || i == 100 || i == 120 || i == 140 || i == 160 ) {
					checkElem = [ i+1, i-20, i+20, i+21, i-19 ]
				}
				else if( i == 19 || i == 39 || i == 59 || i == 79 || i == 99 || i == 119 || i == 139 || i == 159 || i == 179 ) {
					checkElem = [ i-1, i-20, i+20, i-21, i+19 ]
				}
				else if ( i >= 1 && i <= 18) {
					checkElem = [i+1, i-1, i+20, i+19, i+21]
				}
				else if ( i >= 181 && i <= 199) {
					checkElem = [i+1, i-1, i-20, i-19, i-21]
				}else {
					checkElem = [i-21, i-20, i-19, i+1, i+21, i+20, i+19, i-1];
				}
				
				//Открываю верхние клетки
				for(let j = 0; j < checkElem.length; j++) {
					allSquareUp[checkElem[j]].style.opacity = '0';
				}
		}

		/*Функция подготавливает к открытии клеток при клике */
		function openFirstTime(target) {
			console.log(target)
			var i = +target.dataset.number;

			if(allSquareDown[i].innerHTML === '0') {
				openSquaresUp(i)
			}
			
			// for(let j = 0; j < checkElem.length; j++) {	
			// 	if(allSquareDown[checkElem[j]].innerHTML == '0') {
			// 		allSquareUp[checkElem[j]].style.opacity = '0';
			// 	}
			// }
		}
		openFirstTime(target);
		/*Здесь напишу функцию, которая при клике, будет проверять соседние клетки. Если найдет то будет вызываться снова
		уже с этой найденой клеткой и так пока соседние клетки не будут пустые.*/
		// function findEmptySquares() {
		// 	var checkElem = [];
		// var i = +target.dataset.number;
		// 	if(allSquareDown[i].innerHTML == '0') {
		// 		openSquaresUp(i)
		// 	}
		// 	//Для крайних и угловых клеточек будет свой масcив для проверки соседних клеточек
		// 	if ( i == 0 ) {
		// 		checkElem = [ i+1, i+20, i+21 ];
		// 	}
		// 	else if ( i == 180 ) checkElem = [ i+1, i-20, i-19 ];
		// 	else if ( i == 19 ) checkElem = [ i-1, i+20, i+19 ];
		// 	else if ( i == 19 ) checkElem = [ i-1, i+20, i+19 ];
		// 	else if ( i == 199 ) checkElem = [ i-1, i-20, i-21 ];
		// 	else if( i == 20 || i == 40 || i == 60 || i == 80 || i == 100 || i == 120 || i == 140 || i == 160 ) {
		// 		checkElem = [ i+1, i-20, i+20, i+21, i-19 ]
		// 	}
		// 	else if( i == 19 || i == 39 || i == 59 || i == 79 || i == 99 || i == 119 || i == 139 || i == 159 || i == 179 ) {
		// 		checkElem = [ i-1, i-20, i+20, i-21, i+19 ]
		// 	}
		// 	else if ( i >= 1 && i <= 18) {
		// 		checkElem = [i+1, i-1, i+20, i+19, i+21]
		// 	}
		// 	else if ( i >= 181 && i <= 199) {
		// 		checkElem = [i+1, i-1, i-20, i-19, i-21]
		// 	}else {
		// 		checkElem = [i-21, i-20, i-19, i+1, i+21, i+20, i+19, i-1];
		// 	}
		// 	//Ищу клеточки у которых 0 бомб.
		// 	for(let j = 0; j < checkElem.length; j++) {
		// 		console.log(checkElem);
		// 		if(allSquareDown[checkElem[j]].innerHTML == '0') {
		// 			openSquaresUp(checkElem[j]);
		// 			findEmptySquares(allSquareDown[checkElem[j]])
		// 		} else {
		// 			return;
		// 		}
		// 	}
		// }
		// findEmptySquares()
	}
}


const options = {
	saper: '.saper',
	saperInfo: '.saper__info',
	saperField: '.saper__field',
	saperFieldSquareDown: '.saper__field_square-down',
	saperFieldSquare: '.saper__field_square',
	saperTime: '.saper__info_time'
	
}

new Saper(options);