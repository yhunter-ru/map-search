var mapSearchKeyword="", mapSearch, mapSearchClusterer = [], mapSearchPoints = [];
ymaps.ready(init); //Инициализация карты
        
        function init() {  // Создание карты            
                mapSearch = new ymaps.Map("mapSearch__conrainer", {
                center: mapCenter, //Центр карты по умолчанию
                zoom: mapZoom, //Зум по умолчанию
                controls: ['zoomControl', 'geolocationControl'] //Элементы управления
            });

            function removeMapPoints() { //Функция очистки метокс карты
                mapSearch.geoObjects.removeAll();
            }
            var mapsSearchField = document.getElementById('mapSearchField'); //ID поля ввода
            var mapsSearchResult = document.getElementById('mapSearchResult'); //ID поля ввода
            mapsSearchField.oninput = function () { //Детектим изменение поля ввода и выводим иконки заново
                mapSearchKeyword =  mapsSearchField.value;  // Задаем поисковую строку
                removeMapPoints(); // Убираем иконки
                showMapPoints();  // Добавляем иконки
            };

            mapsSearchField.value = 'Поиск по карте'; //Очищаем поле ввода
            showMapPoints(); //Показываем метки            

            function showMapPoints() {
                mapSearchKeyword=mapSearchKeyword.toLowerCase();
                mapSearchPoints=[];
                var filteredMapPints = mapPoints.filter(function(mapSearch){
                    var NameAndAddress = mapSearch.name+mapSearch.address; // Суммируем название метки и адрес для поиска по обоим
                    NameAndAddress = NameAndAddress.toLowerCase();
                    return NameAndAddress.indexOf(mapSearchKeyword) > -1; 
                });

                var index, placemark = [];
                mapSearchClusterer = new ymaps.Clusterer({
		                // Макет метки кластера pieChart.
		                clusterIconLayout: 'default#pieChart',
		                // Радиус диаграммы в пикселях.
		                clusterIconPieChartRadius: 25,
		                // Радиус центральной части макета.
		                clusterIconPieChartCoreRadius: 15, 
		                // Ширина линий-разделителей секторов и внешней обводки диаграммы.
		                clusterIconPieChartStrokeWidth: 3,
		                // Определяет наличие поля balloon.
		                hasBalloon: false
		        });
                mapSearchClusterer.options.set({
				        gridSize: 64, //Сетка кластеризации
				});

                for (index = 0; index < filteredMapPints.length; ++index) { // Цикл формирования списка иконок для вывода
                    
                    placemark[index] = new ymaps.Placemark(filteredMapPints[index].coords, {
                                    balloonContentHeader: "<b>"+filteredMapPints[index].name+"</b>",
                                    balloonContentBody: "<i>"+filteredMapPints[index].address+"</i>",
                                    hintContent: filteredMapPints[index].name,
                                }, {                        
                                    preset: "islands#dotIcon", 
                                    iconColor: mapSearchIconColor,
                                    iconLayout: "default#image",
                                    iconImageSize: [33, 50],
                                    iconImageOffset: [-16, -50],
        						    iconImageHref: mapSearchIconLogo
                    });

		            mapSearchPoints.push(placemark[index]); //Добавляем метки в массив                    

                }   
                
                mapSearchClusterer.add(mapSearchPoints); //Добавляем список точек в кластеризатор

                if (mapSearchClusterer._objectsCounter>0) { //Если точек больше одной, меняем видимую область, чтобы все точки поместились с полями 100 точек. Ограничиваем максимальный зум карты на 10;
                    mapSearch.setBounds( mapSearchClusterer.getBounds(), {checkZoomRange:true, zoomMargin:100}).then(function(){ if(mapSearch.getZoom() > mapSearchMaxZoom) mapSearch.setZoom(mapSearchMaxZoom);});
                    mapsSearchResult.innerHTML="Точек на карте: "+mapSearchClusterer._objectsCounter;
                }
                else {
                    mapSearch.setCenter(mapCenter, mapZoom);
                    mapsSearchResult.innerHTML="Ничего не найдено";
                }
                mapSearch.geoObjects.add(mapSearchClusterer); //Добавляем кластеры на карту       

            }   
        }  