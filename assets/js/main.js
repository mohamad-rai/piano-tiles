const END_OF_VIEW = window.visualViewport.height+350;
const TILE_START = -350;
let speed = 2000;
let timeStep = tileNumber = 0, startInterval;
// const MUSIC_NOTE = [
//     {
//         "time":0,
//         "column":1,
//         "thrown":false
//     },
//     {
//         "time":300,
//         "column":2,
//         "thrown":false
//     },
//     {
//         "time":1200,
//         "column":3,
//         "thrown":false
//     },
//     {
//         "time":1400,
//         "column":4,
//         "thrown":false
//     },
//     {
//         "time":2000,
//         "column":1,
//         "thrown":false
//     },
//     {
//         "time":2100,
//         "column":2,
//         "thrown":false
//     },
//     {
//         "time":3200,
//         "column":3,
//         "thrown":false
//     },
//     {
//         "time":3500,
//         "column":4,
//         "thrown":false
//     },
//     {
//         "time":4100,
//         "column":1,
//         "thrown":false
//     },
//     {
//         "time":4300,
//         "column":2,
//         "thrown":false
//     },
//     {
//         "time":5400,
//         "column":3,
//         "thrown":false
//     },
//     {
//         "time":5600,
//         "column":4,
//         "thrown":false
//     },
//     {
//         "time":6100,
//         "column":3,
//         "thrown":false
//     },
//     {
//         "time":6600,
//         "column":4,
//         "thrown":false
//     },
//     {
//         "time":7200,
//         "column":1,
//         "thrown":false
//     },
//     {
//         "time":7600,
//         "column":3,
//         "thrown":false
//     },
//     {
//         "time":7900,
//         "column":4,
//         "thrown":false
//     },
//     {
//         "time":8400,
//         "column":2,
//         "thrown":false
//     },
//     {
//         "time":8800,
//         "column":4,
//         "thrown":false
//     }
// ];
const MUSIC_NOTE = [];
const LOAD_TILES = [];
let loadNote = $.getJSON('files/music.json',function (data) {
    MUSIC_NOTE.push(...JSON.parse(data));
});
let au = new Audio('files/audio.mp3');
$(function (){
    $('.column').on('click',function(){
        let target = MUSIC_NOTE.find(v=>v.thrown === false);
        let lastInStack = LOAD_TILES.shift();
        let currentColumn = +$(this).attr('id').split('-')[1];
        if(target.time === lastInStack && target.column === currentColumn) {
            $(this).find('span:first').remove();
            target.thrown = true;
        }
        else {
            LOAD_TILES.unshift(lastInStack);
        }
    });
    $.when(loadNote, au).done(function(){
        setTimeout(()=>au.play(), 1500);
        startInterval = setInterval(()=>{
            if(MUSIC_NOTE[tileNumber]){
                if(MUSIC_NOTE[tileNumber].time === timeStep){
                    LOAD_TILES.push(MUSIC_NOTE[tileNumber].time);
                    let col = $(`#column-${MUSIC_NOTE[tileNumber].column}`);
                    const newTile = $(`<span class="tile" data-time="${MUSIC_NOTE[tileNumber].time}"></span>`);
                    newTile.css("top",TILE_START);
                    col.append(newTile);
                    newTile.animate({top:`+=${END_OF_VIEW}`},speed,"linear",function(){
                        if(LOAD_TILES.includes($(this).data('time'))){
                            au.pause();
                            theEnd();
                        }
                    });
                    tileNumber++;
                }
            }
            timeStep += 100;
        }, 100);
    });
});
const theEnd = () => {
    clearInterval(startInterval);
    console.log('end');
    $('#board').addClass('red');
    $('span').stop();
}

