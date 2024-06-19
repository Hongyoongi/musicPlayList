function loadDoc() {
const xhttp = new XMLHttpRequest();
xhttp.onload = function() {
    myFunction(this);
    
  }
  xhttp.open("GET", "cd_catalog.xml");
  xhttp.send();
}
let x;
function myFunction(xml){
    let xmlDoc = xml.responseXML;
    x = xmlDoc.getElementsByTagName("CD");
    document.getElementById("selectList").innerHTML =
    "<option selected>"+x[0].getElementsByTagName("TITLE")[0].childNodes[0].nodeValue+"</option>"
    for(let i =1; i<x.length; i++){
        document.getElementById("selectList").innerHTML +=
        "<option>"+x[i].getElementsByTagName("TITLE")[0].childNodes[0].nodeValue+"</option>"
    }
}

let selectIdx,optionList,txt,idx,audio, playBtn, playJung,msg,msgChk,time,vol;
let chk= true;

function mInit(){/*select창 로드 및 뮤직 로드*/
    
    audio = document.getElementById("ssong");             // audio 소스 
    playBtn=document.getElementById("playBtn");        // 플레이버튼
    playJung=document.getElementById("playJung");    // 플레이중을 표시하는 이미지
    msgChk=document.getElementById("msg");             //  노래의 상태를 나타내는 구역
    time=document.getElementById("curr");                 //  노래의 총 길이와 현재 부분을 나타내는 구역
    mus=document.getElementById("mus");                  //  노래의 위치를 갈수 있는 range
    if(audio.ended){
        mus.value=0;
    }
}
function mList(){/*select창 보이기 숨기기 */
    if(chk){
        document.getElementById("selectList").style.display = 'block';
        chk= false;
    }else{
        document.getElementById("selectList").style.display = 'none';
        chk= true;
    }
}
function imgCng(){/*이미지변경 */
    selectIdx= document.getElementById("selectList").selectedIndex;
    optionList = document.getElementById("selectList").options;
    
    txt =optionList[selectIdx].text;
    idx =optionList[selectIdx].index;
    
    document.getElementById("showImg").src=x[idx].getElementsByTagName("CDIMG")[0].childNodes[0].nodeValue;   //노래 목록을 변경하면 이미지 변경
    document.getElementById("musicList").innerText=x[idx].getElementsByTagName("TITLE")[0].childNodes[0].nodeValue;;     //노래 목록을 변경하면 노래제목 변경
    audio.src=x[idx].getElementsByTagName("CDMUSIC")[0].childNodes[0].nodeValue;
    audio.play();
    playBtn.src="./img/pause.png";              //노래가 시작하면 재생 이미지 변경
    playJung.src="./img/norae.gif";             //노래가 시작하면 노래 재생중이라는 gif로 움직임
    msgChk.innerText="🎶플레이중🎶";    //노래가 시작하면 표시해주는 메세지
    audio.addEventListener("timeupdate", getCurTime);   //노래의 현재 진행시간을 보여주는 이벤트리스너
    mus.value=0;                                         //노래가 다음으로 넘어가면 프로그래스바 초기화
}
idx=0;
function musicSet(num){/*노래 넘기기 */
    switch(num){
        case 0:
            idx=0;
            msg="🎼첫번째 노래";
            break;
        case 1:
            if(idx==0){
                msg="🎼첫번째 노래";
            }else{
                idx--;
                msg="🎶플레이중🎶";
            }
            break;
        case 2:
            if(idx==x.length-1){
                msg="🎼마지막 노래";
            }else{
                idx++; 
                msg="🎶플레이중🎶";
            }
            break;
        case 3:
            idx=x.length-1;
            msg="🎼마지막 노래";
            break;
    }
    document.getElementById("showImg").src=x[idx].getElementsByTagName("CDIMG")[0].childNodes[0].nodeValue;             //노래가 넘어갈 때 이미지 변경
    document.getElementById("musicList").innerText=x[idx].getElementsByTagName("TITLE")[0].childNodes[0].nodeValue;  //노래가 넘어갈 때 제목 변경
    document.getElementById("selectList").selectedIndex = idx;      //노래가 넘어갈 때 목록의 focus 이동
    audio.src=x[idx].getElementsByTagName("CDMUSIC")[0].childNodes[0].nodeValue;         //노래를 선택하는 값으로 load
    msgChk.innerText=msg;         //노래의 현재 상태를 보여주는 메시지
    playBtn.src="./img/pause.png";
    playJung.src="./img/norae.gif";
    mus.value=0;    //노래가 다시 시작할 때 속성 값을 0으로 돌림
    audio.play();
}
function progress(){/*프로그래스바 설정*/
    mus.max=audio.duration;         //프로그래스바의 길이를 노래의 길이만큼 설정
    audio.currentTime=mus.value; //움직이는 값으로 노래의 시간을 변경
}
let timeChk;
var min,sec,nMin,nSec;
function getCurTime(){/*노래시간 업데이트*/
    if(audio.duration){/*오디오 총시간을 구하고 문자열의 남는 부분을 0으로 채운다. */
        min = (parseInt((audio.duration%3600)/60)).toString().padStart(2, '0');
        sec = (parseInt(audio.duration%60)).toString().padStart(2, '0');
        nMin = (parseInt((audio.currentTime%3600)/60)).toString().padStart(2, '0');
        nSec= (parseInt(audio.currentTime%60)).toString().padStart(2, '0');
        timeChk= nMin+":"+nSec+"/"+min+":"+sec;
    }else{
        timeChk= "00:00/00:00";
    }
    time.innerText=timeChk;     //노래의 현재부분과 총시간을 표시
}

function musicPlay(){/*노래 재생, 일시정지 */
  if(audio.paused){
        msg="🎶플레이중🎶";
        audio.play();
        playBtn.src="./img/pause.png";      //노래가 플레이중이면 재생이미지변경
        playJung.src="./img/norae.gif";     //노래가 플레이중이면 표시이미지변경
    }else{
        msg="⏸일시정지";
        audio.pause();
        playBtn.src="./img/play.png";       //노래가 정지가되면 재생이미지변경
        playJung.src="./img/norae.png";  //노래가 정지가되면 표시이미지변경
    }
    msgChk.innerText=msg;         //노래의 현재 상태를 보여주는 메시지
    audio.addEventListener("timeupdate", getCurTime);   //노래의 재생시간을 알려주는 이벤트 리스너
}
function musicStop(){/* 노래정지 */
        msg="⏹노래정지";
        audio.pause();
        audio.currentTime=0;                   //노래를 정지하면 처음부분으로 돌아감
        playBtn.src="./img/play.png";       //노래가 정지하면 재생이미지변경
        playJung.src="./img/norae.png";  //노래가 정지하면 표시이미지변경
        msgChk.innerText=msg;               //노래의 현재 상태를 보여주는 메시지
        mus.value=0;                                //노래가 정지할 때 속성 값을 0으로 돌림
}  
var swLoop=0;
function mLoop(){/*반복재생*/
    if(swLoop==0){
        document.getElementById("musicLoop").style.color="red";
        swLoop=1;
        audio.loop=true;
    }else{
        document.getElementById("musicLoop").style.color="black";
        swLoop=0;
        audio.loop=false;
    }   
}  

function nextPlay(){/*노래가 끝나면 다음 노래로 이동 */
    if(audio.ended){    //노래가 끝나면 배열이 증가
        idx++;
    }
    audio.src = audioAry[idx];
    audio.currentTime = 0;                 //노래를 정지하면 처음부분으로 돌아감
    mus.value=0;                                //노래가 넘어갈 때 속성 값을 0으로 돌림
    audio.play();
    document.getElementById("showImg").src=x[idx].getElementsByTagName("CDIMG")[0].childNodes[0].nodeValue;             //노래가 넘어갈 때 이미지 변경
    document.getElementById("musicList").innerText=x[idx].getElementsByTagName("TITLE")[0].childNodes[0].nodeValue;  //노래가 넘어갈 때 제목 변경
    document.getElementById("selectList").selectedIndex = idx;      //노래가 넘어갈 때 목록의 focus 이동
    }
    
