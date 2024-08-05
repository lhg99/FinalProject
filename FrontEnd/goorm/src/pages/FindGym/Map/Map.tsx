import React, { useCallback, useEffect, useRef, useState } from 'react';
import './Map.scss';
import { SearchIcon } from '../../../image/SearchIcon';

declare global {
    interface Window {
        kakao: any;
    }
}

const Map = () => {
    const [keyword, setKeyword] = useState<string>('수원 헬스장');
    const inputRef = useRef<HTMLInputElement>(null);
    const mapRef = useRef<any>(null);
    const psRef = useRef<any>(null);
    const infowindowRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);

    useEffect(() => {
        const kakaoMapsLoaded = () => {
            let container = document.getElementById("map");
            let options = {
                center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
                level: 3,
            };

            if (container) {
                mapRef.current = new window.kakao.maps.Map(container, options);
                psRef.current = new window.kakao.maps.services.Places();
                infowindowRef.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });
            }

            searchPlaces();

            document.getElementById('searchButton')?.addEventListener('click', searchPlaces);
        };

        if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
            window.kakao.maps.load(kakaoMapsLoaded);
        } else {
            const script = document.createElement('script');
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&libraries=services`;
            script.onload = kakaoMapsLoaded;
            document.head.appendChild(script);
        }

        return () => {
            document.getElementById('searchButton')?.removeEventListener('click', searchPlaces);
        };
    }, [keyword]);

    const searchPlaces = () => {
        if (!keyword.replace(/^\s+|\s+$/g, '')) {
            alert('키워드를 입력해주세요!');
            return false;
        }

        psRef.current.keywordSearch(keyword, placesSearchCB);
    };

    useEffect(() => {
        if (keyword) {
            searchPlaces();
        }
    }, [keyword]);

    const placesSearchCB = (data: any, status: any, pagination: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
            displayPlaces(data);
            displayPagination(pagination);
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
            alert('검색 결과가 존재하지 않습니다.');
        } else if (status === window.kakao.maps.services.Status.ERROR) {
            alert('검색 결과 중 오류가 발생했습니다.');
        }
    };

    const displayPlaces = (places: any) => {
        var listEl = document.getElementById('placesList'); 
        let menuEl = document.getElementById('menu_wrap');
        let fragment = document.createDocumentFragment();
        let bounds = new window.kakao.maps.LatLngBounds(); 

        if (!listEl || !menuEl) return;

        removeAllChildNodes(listEl);
        removeMarker();
        
        for (let i = 0; i < places.length; i++) {
            var placePosition = new window.kakao.maps.LatLng(places[i].y, places[i].x),
                marker = addMarker(placePosition, i, places[i].place_name), 
                itemEl = getListItem(i, places[i]);

            bounds.extend(placePosition);

            if (itemEl) {
                (function (marker, title, itemEl) {
                    window.kakao.maps.event.addListener(marker, 'mouseover', function () {
                        displayInfowindow(marker, title);
                    });

                    window.kakao.maps.event.addListener(marker, 'mouseout', function () {
                        infowindowRef.current.close();
                    });

                    itemEl.onmouseover = function () {
                        displayInfowindow(marker, title);
                    };

                    itemEl.onmouseout = function () {
                        infowindowRef.current.close();
                    };
                })(marker, places[i].place_name, itemEl);
            }

            fragment.appendChild(itemEl);
        }

        listEl.appendChild(fragment);
        menuEl.scrollTop = 0;
        mapRef.current.setBounds(bounds);
    };

    const getListItem = (index: number, places: any) => {
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
    };

    const addMarker = (position: any, idx: any, title: string) => {
        var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png',
            imageSize = new window.kakao.maps.Size(36, 37),
            imgOptions = {
                spriteSize: new window.kakao.maps.Size(36, 691),
                spriteOrigin: new window.kakao.maps.Point(0, (idx * 46) + 10),
                offset: new window.kakao.maps.Point(13, 37)
            },
            markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
            marker = new window.kakao.maps.Marker({
                position: position,
                image: markerImage
            });

        marker.setMap(mapRef.current);
        markersRef.current.push(marker);
        return marker;
    };

    const removeMarker = () => {
        for (var i = 0; i < markersRef.current.length; i++) {
            markersRef.current[i].setMap(null);
        }   
        markersRef.current = [];
    };

    const displayPagination = (pagination: any) => {
        var paginationEl = document.getElementById('pagination');
        let fragment = document.createDocumentFragment();
        let i;

        if (!paginationEl) return null;

        while (paginationEl.hasChildNodes()) {
            paginationEl.removeChild(paginationEl.lastChild!);
        }

        for (i = 1; i <= pagination.last; i++) {
            var el = document.createElement('a');
            el.href = "#";
            el.innerHTML = i.toString();

            if (i === pagination.current) {
                el.className = 'on';
            } else {
                el.onclick = (function (i) {
                    return function () {
                        pagination.gotoPage(i);
                    }
                })(i);
            }

            fragment.appendChild(el);
        }
        paginationEl.appendChild(fragment);
    };

    const displayInfowindow = (marker: any, title: string) => {
        var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

        infowindowRef.current.setContent(content);
        infowindowRef.current.open(mapRef.current, marker);
    };

    const removeAllChildNodes = (el: any) => {   
        while (el.hasChildNodes()) {
            el.removeChild(el.lastChild);
        }
    };

    return (
        <div className='findGym'>
            <p className='gymText'>헬스장 검색</p>
            <div className="option">
                <div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if(inputRef.current) {
                            setKeyword(inputRef.current.value);
                            } else {
                                console.error("검색어 로직 실패");
                        }
                    }}>
                        키워드 : <input type="text" ref={inputRef} defaultValue={keyword} id="keyword" size={15} />
                        <button type="submit" id="searchButton">
                            <SearchIcon />
                        </button>
                    </form>
                </div>
            </div>
            <div className="map_wrap">
                <div id="map" style={{  }}></div>

                <div id="menu_wrap" className="bg_white">
                    <hr />
                    <ul id="placesList"></ul>
                    <div id="pagination"></div>
                </div>
            </div>
        </div>
    );
}

export default Map;
