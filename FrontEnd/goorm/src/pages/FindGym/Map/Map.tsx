import React, { useEffect, useState } from 'react';

declare global {
    interface Window {
        kakao: any;
    }
}

const Map = () => {
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        const kakaoMapsLoaded = () => {
            let container = document.getElementById("map");
            let options = {
                center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                level: 3,
            };

            let markers: any = [];
            let map = new window.kakao.maps.Map(container, options);
            let ps = new window.kakao.maps.services.Places();
            let infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });

            const searchPlaces = () => {
                if (!keyword.trim()) {
                    alert('키워드를 입력해주세요!');
                    return;
                }

                ps.keywordSearch(keyword, placesSearchCB);
            }

            function placesSearchCB(data: any, status: any, pagination: any) {
                if (status === window.kakao.maps.services.Status.OK) {
                    displayPlaces(data);
                    displayPagination(pagination);
                } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                    alert('검색 결과가 존재하지 않습니다.');
                } else if (status === window.kakao.maps.services.Status.ERROR) {
                    alert('검색 결과 중 오류가 발생했습니다.');
                }
            }

            function displayPlaces(places: any) {
                var listEl = document.getElementById('placesList'); 
                let menuEl = document.getElementById('menu_wrap');
                let fragment = document.createDocumentFragment();
                let bounds = new window.kakao.maps.LatLngBounds(); 

                if(!listEl || !menuEl) return;

                removeAllChildNods(listEl);
                removeMarker();
                
                for ( let i=0; i<places.length; i++ ) {
                    var placePosition = new window.kakao.maps.LatLng(places[i].y, places[i].x),
                        marker = addMarker(placePosition, i, places[i].place_name), 
                        itemEl = getListItem(i, places[i]);

                    bounds.extend(placePosition);

                    if(itemEl) {
                        (function(marker, title, itemEl) {
                            window.kakao.maps.event.addListener(marker, 'mouseover', function() {
                                displayInfowindow(marker, title);
                            });

                            window.kakao.maps.event.addListener(marker, 'mouseout', function() {
                                infowindow.close();
                            });

                            itemEl.onmouseover =  function () {
                                displayInfowindow(marker, title);
                            };

                            itemEl.onmouseout =  function () {
                                infowindow.close();
                            };
                        })(marker, places[i].place_name, itemEl);
                    }

                    fragment.appendChild(itemEl);
                }

                listEl.appendChild(fragment);
                menuEl.scrollTop = 0;
                map.setBounds(bounds);
            }

            function getListItem(index: any, places: any) {
                const el = document.createElement('li');
                let itemStr = `<span class="markerbg marker_${index + 1}"></span>` +
                    `<div class="info">` +
                    `<h5>${places.place_name}</h5>`;

                if (places.road_address_name) {
                    itemStr += `<span>${places.road_address_name}</span>` +
                        `<span class="jibun gray">${places.address_name}</span>`;
                } else {
                    itemStr += `<span>${places.address_name}</span>`;
                }

                itemStr += `<span class="tel">${places.phone}</span>` +
                    `</div>`;

                el.innerHTML = itemStr;
                el.className = 'item';
                return el;
            }

            function addMarker(position: any, idx: any, title: string) {
                var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png',
                    imageSize = new window.kakao.maps.Size(36, 37),
                    imgOptions =  {
                        spriteSize : new window.kakao.maps.Size(36, 691),
                        spriteOrigin : new window.kakao.maps.Point(0, (idx*46)+10),
                        offset: new window.kakao.maps.Point(13, 37)
                    },
                    markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
                        marker = new window.kakao.maps.Marker({
                        position: position,
                        image: markerImage 
                    });

                marker.setMap(map);
                markers.push(marker);
                return marker;
            }

            function removeMarker() {
                for ( var i = 0; i < markers.length; i++ ) {
                    markers[i].setMap(null);
                }   
                markers = [];
            }

            function displayPagination(pagination: any) {
                var paginationEl = document.getElementById('pagination');
                let fragment = document.createDocumentFragment();
                let i;

                if(!paginationEl) return;

                while (paginationEl.hasChildNodes()) {
                    paginationEl.removeChild (paginationEl.lastChild!);
                }

                for (i=1; i<=pagination.last; i++) {
                    var el = document.createElement('a');
                    el.href = "#";
                    el.innerHTML = String(i);

                    if (i===pagination.current) {
                        el.className = 'on';
                    } else {
                        el.onclick = (function(i) {
                            return function() {
                                pagination.gotoPage(i);
                            }
                        })(i);
                    }

                    fragment.appendChild(el);
                }
                paginationEl.appendChild(fragment);
            }

            function displayInfowindow(marker: any, title: string) {
                var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

                infowindow.setContent(content);
                infowindow.open(map, marker);
            }

            function removeAllChildNods(el: any) {   
                while (el.hasChildNodes()) {
                    el.removeChild (el.lastChild);
                }
            }
            document.getElementById('searchButton')?.addEventListener('click', searchPlaces);
        };

        if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
            window.kakao.maps.load(kakaoMapsLoaded);
        } else {
            const script = document.createElement('script');
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_REAL_API_KEY&libraries=services`;
            script.onload = kakaoMapsLoaded;
            document.head.appendChild(script);
        }

        return () => {
            document.getElementById('searchButton')?.removeEventListener('click', kakaoMapsLoaded);
        };
    }, []);

    return (
        <div>
            <div>
                <h2>주변 헬스장 검색</h2>
                <div>
                    <label htmlFor='keyword'>헬스장 검색</label>
                    <input 
                        id="keyword" 
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button id="searchButton">검색</button>
                </div>
            </div>
            <div id="menu_wrap" className="bg_white">
                <ul id="placesList"></ul>
                <div id="pagination"></div>
            </div>
            <div id='map' style={{ width: '100%', height: '500px' }}></div>
        </div>
    );
}

export default Map;
