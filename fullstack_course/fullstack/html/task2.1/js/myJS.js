
const myURL2 = "https://api.coingecko.com/api/v3/coins/"

let aboutAll=[];
let myCoins = [];
let dataTo = [];
let toggleCoins = [];
let myPoints = [];
let interval = false;
let thisDataTO = [];
let sessionCoins=[];
// let isHide=true;

let singleData = {
  type: "spline",
  xValueType: "dateTime",
  name: "",
  showInLegend: true,
  xValueFormatString: "hh:mm:ss TT",
  yValueFormatString: "#,##0 ",
  dataPoints: thisDataTO,
};
// $("#toSearch").addEventListener("keypress",(event)=>{
//   if (event.key === "E") {
//     console.log("ENTER");
//     event.preventDefault();
//     document.getElementById("search").click();
//   }
//   else{
//     console.log("NO");
//   }
// });

$(() => {
  $(".container1").css("display", "block");
  getData();

});
const choice = ()  => {
  $("#toChoice").html("");
  myCoins.map((item)=>{
    if(toggleCoins.includes(item.symbol.toUpperCase())){
  $("#toChoice").append(`<div class="card">
        <label class="switch">
        <input type="checkbox" class="check" id=(${item.symbol.toUpperCase()}) onclick='addRemove(${JSON.stringify(item)})'>
        <span class="slider round"></span>
        </label>
        <p>${item.symbol.toUpperCase()}</p>
        <p>${item.name}</p><br>
        </div>`)}});
  $(".check").prop("checked", true);
  $("#myModal").css("display","block");   
};

const save = () => {
  if (toggleCoins.length <= 5)
  {
    $("#myModal").css("display","none");   
    $(".check1").prop("checked", false);
    myCoins.map((item)=>
    {
    if(toggleCoins.includes(item.symbol.toUpperCase()))
    {
      let index = myCoins.indexOf(item);
      console.log(index);
      $(".check1").eq(index).prop("checked", true);//go to the specific index to mark the checkbox

    }
    })
  }else{
    alert("The choice is limited to 5 coins only, mark the coin you want to remove");
  }
  };
const getData = () => {
  $.ajax({
    url: myURL2,
    success: (response) => {
      console.log(response);
      myCoins = response;
      console.log(myCoins);
      $(".container1").css("display", "none");
      home();
    },
    error: (error) => {
      console.log(error);
    },
  });
};



const home = () => {
    dataTo = [];
    myPoints = [];
    const stopInterval = () => clearInterval(myInter);
    (interval?stopInterval():console.log("home"));
    interval = false;
    toggleCoins = [];
    $("#res").html("");
    myCoins.map((item)=>{
      printCard(item);})
};



const printCard = (item) => {
  //let newInfo=moreInfo(item);
  $("#res").append(`<div class="card" >
          <label class="switch">
          <input type="checkbox" class="check1" onclick='addRemove(${JSON.stringify(item)})'/>
          <span class="slider round"></span>
          </label>
          <div class="card-body">
          <p>${item.symbol.toUpperCase()}</p>
          <p>${item.name}</p><br>
          <input type="button"  id="infoButton_${item.id}" value="More Info" class="btn btn-success btn_info" onclick='moreInfo(${JSON.stringify(
            item
          )})'/></div><div/>
          <div  class="allInfo" id=${item.id}></div>`);
  // $("#more").hide();
  console.log(item);
    
};
//A function to retrieve specific API information when the information request button is clicked
const specificCoin = (coin) => {
  $(".container1").css("display", "block");
  $.ajax({
    url: myURL2+coin,
    success: (response) => {
      console.log(response);
      let temp=response;
      returnCoin(temp);//build the field of coin's info and put it in the session storage
      $(".container1").css("display", "none");
    },
    error: (error) => {
      console.log(error);
    },
  });
};

//build the field of coin's info and put it in the session storage
 const returnCoin=(temp)=>{
    //console.log(temp);
    //Create a new literal object that contains the desired information
    let myInfo = { ...AllInfo };
    myInfo.image = temp.image.thumb;
    myInfo.usd = temp.market_data.current_price.usd;
    myInfo.eur = temp.market_data.current_price.eur;
    myInfo.ils = temp.market_data.current_price.ils;
    console.log(myInfo);
    //return (myInfo);
    sessionCoins.push(temp.id);//צריך בדיקה, לא ברור למה המערך נדרש
    //We will create a variable with the current time and put it in the literal object
    let time=new Date();
    myInfo.currentTime=Number(time.getTime());
    //console.log(time.getMinutes());
    //We will push the object to sessionStorage with ID as keyword
    sessionStorage.setItem(temp.id,JSON.stringify(myInfo));
    //go over the entire set of coins

      
//console.log(item.id);
  
      $("#"+temp.id).html(`
      <p id="info"><img src=${myInfo.image}/>&nbsp <span>USD:</span> ${myInfo.usd}$&nbsp <span>EUR:</span> ${myInfo.eur}&#8364 &nbsp <span>ILS:</span> ${myInfo.ils}&#8362 </p>
      `);
    
 }

//an object for every coin that we want to see its' info
let AllInfo = {
  image: "",
  usd: 0,
  eur: 0,
  ils: 0,
  currentTime:0
};

const moreInfo = (data) => {
  //We will check whether the value of the button is more or less and act accordingly
  if($("#infoButton_"+data.id).val()=="More Info")
  {
    //If the value of the button is "more information" we will change its value to "less" and send the card check function with the information
    $("#infoButton_"+data.id).val("Less Info");
    console.log(data.name);
    checkData(data);

  }
  else{
    //If the value of the button is "less information" we will change its value to "more"
    $("#infoButton_"+data.id).val("More Info");
    //Go through all the tabs to check if there is a tab with open information

    $("#"+data.id).html("");
  }
  
  // checking if price data is update
  
};
//A function in which we check whether the presentation of the information has already happened and if so how much time has passed since the last time
const checkData=(data)=>{
  let newTime=new Date();//We will create a current time in order to compare to the previous time (if any) when the information appeared
  //check if sessionStorage contains the information about our specific currency
  if(sessionCoins.includes(data.id)){
    //If so, we will extract the object of the coin from there
    let temp=JSON.parse(sessionStorage.getItem(data.id));
    console.log(temp.currentTime);
    //check whether the difference between the previous time found in the object and the current time we created is greater or less than two minutes
    if(Number(newTime.getTime())-temp.currentTime>=120000){
      specificCoin(data.id.toLowerCase());//If the difference is large then we will send to a function that will update the information
    }
    else{
      //If the difference is small then we will present the same information again
        $("#"+data.id).html(`
        <p id="info"><img src=${temp.image}/>&nbsp <span>USD:</span> ${temp.usd}$&nbsp <span>EUR:</span> ${temp.eur}&#8364 &nbsp <span>ILS:</span> ${temp.ils}&#8362 </p>
        `);
    }    
  }
  //check if sessionStorage not contains the information
  else{
    specificCoin(data.id.toLowerCase());//send to a function that will update the information
    
  }
  console.log(sessionCoins);
};

let point = {
  x: "",
  y: "",
};

function addRemove(data){//Create an array that contains the coins selected for live
  myCoins.map((item)=>{
    if(item.id == data.id){
      if (toggleCoins.includes(item.symbol.toUpperCase())){//if the array contains the coin then we have to remove it
        const index = toggleCoins.indexOf(item.symbol.toUpperCase());
        toggleCoins.splice(index, 1);}
      else{
        if(toggleCoins.length < 5){toggleCoins.push(item.symbol.toUpperCase());}
        else{
          toggleCoins.push(item.symbol.toUpperCase());
          choice();
        }
      }
    }
  })
  console.log(toggleCoins);
}

// function hideShow(data) {
//   console.log(data.id);
//   $(".card-info").closest(`div[id^=${data.id}]`).toggle(); //go to the specific information div to show/hide
// }

const myTitle = ()=>{//create title for the graph
  let myText = "";
  toggleCoins.map((item)=> myText += item + ",");
  let myCoinsTo = myText.substring(0, myText.length - 1);
  myText = myCoinsTo
  return myText
};  

const live2 = ()  => {
  var options = {
    exportEnabled: true,
    animationEnabled: true,
    title:{
      text: myTitle() + " to USD"
    },
    subtitles: [{
      text: "Click Legend to Hide or Unhide Data Series"
    }],
    axisX: {
      title: "timeline",
      
    },
    axisY: {
      title: "Coin Value",
      titleFontColor: "#4F81BC",
      lineColor: "#4F81BC",
      labelFontColor: "#4F81BC",
      tickColor: "#4F81BC"
    },
    
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: "pointer",
      itemclick: toggleDataSeries
    },
    data: dataTo,
    
  };

  getLiveData();

  pushPoint(myPoints, dataTo);

  $("#res").CanvasJSChart(options);

  function toggleDataSeries(e) {
      if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      e.chart.render();
    }
};


const getLiveData = ()=>{// get live data from API
  let myURL3 = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${myTitle()}&tsyms=USD`
  $.ajax({
    url: myURL3,
    success: (response) => 
    { 
      myPoints = [];
      toggleCoins.map((item)=>{
      myPoints.push(createPoint(response, item));
      });
      console.log(myPoints);
      $(".container1").css("display", "none");
    },    
    error: (error) => {
      console.log(error);
    },
  })
};

const createPoint = (response, item) => {//create point from the live data.
  var myPoint = {...point};
  let time = new Date();
  myPoint.x = time.getTime();
  myPoint.y = response[item]["USD"];
  return myPoint;
};

const pushPoint = (myPoints, dataTo)  => {//add the new point to the graph
  for (let i = 0; i < myPoints.length; i+=1) 
  {if(dataTo[i]["dataPoints"].length > 0)
    {
      dataTo[i]["dataPoints"].push(myPoints[i]);
    }else{
      let thisDataTO = [];
      dataTo[i]["dataPoints"] = thisDataTO;
      dataTo[i]["dataPoints"].push(myPoints[i]);
    }
  }
};

const addData = () => {//create object to all selected coins
  toggleCoins.map((item)=>{
    let mySingleData = {...singleData};
    mySingleData.name = item,
    dataTo.push(mySingleData)
  })
  console.log(dataTo);
};


const live = ()=>{
    $(".container1").css("display", "block");
    console.log(toggleCoins);      
    addData();
    interval = true;
    const myInterval = () => myInter = setInterval(live2, 2000);
    // const stopInterval = () => clearInterval(myInter);
    myInterval();
    // $("#res").CanvasJSChart(options);
    };


const search = () => {
  let isValid = false;
  myCoins.map((item) => {
    if (
      $("#toSearch").val() == item.name ||
      $("#toSearch").val() == item.symbol.toUpperCase()
    ) {
      isValid = true;
      $("#res").html("");
      printCard(item);
    }
  });
  isValid ? console.log("valid") : $("#res").html("Coin not found");
};


  let AboutMe={//craete a literal object to ease the adding of another person who worked on the project
    firstName:"Ala",
    lastName:"Schwartz",
    ID:51651561653,
    image:"<img id='myImg' src='images/cryptonite-crypto.jpg'/>",
    aboutPJ:"This is an app which contains all the cryptonite coins, shows the information about them and the live graph of their monetary value."
  }

  const about = ()=>{
    dataTo = [];
    const stopInterval = () => clearInterval(myInter);
    (interval?stopInterval():console.log("about"));
    interval = false;
    toggleCoins = [];
    createAbout();
    let showAbout=`<div class="aboutPage"><br/>
    <h1>About The program</h1><br/>
    <p>${aboutAll[0].aboutPJ}</p>
    <br/><br/><br/>
    <h1>The Producers:</h1>
    <div class="grid">
    <div class="infoMe">${aboutAll[0].image}<br/><p><span>${aboutAll[0].firstName} ${aboutAll[0].lastName}</span><br/>${aboutAll[0].ID}</p></div>
    <div class="infoMe">${aboutAll[1].image}<br/><p><span>${aboutAll[1].firstName} ${aboutAll[1].lastName}</span><br/>${aboutAll[1].ID}</p></div>
    <div class="infoMe">${aboutAll[2].image}<br/><p><span>${aboutAll[2].firstName} ${aboutAll[2].lastName}</span><br/>${aboutAll[2].ID}</p></div>
    <div class="infoMe">${aboutAll[3].image}<br/><p><span>${aboutAll[3].firstName} ${aboutAll[3].lastName}</span><br/>${aboutAll[3].ID}</p></div>
    </div></div>`;
    /*aboutAll.map((item)=>{
      showAbout+=`<div class="infoMe">${item.image}<br/><p><span>${item.firstName} ${item.lastName}</span><br/>${item.ID}</p></div>`;
    })

    showAbout+=`</div></div>`;*/
    $("#res").html(showAbout);
  };
  
  function createAbout(){
    let about1={...AboutMe};
    let about2={...AboutMe};
    let about3={...AboutMe};
    let about4={...AboutMe};
    about1.firstName="Tirza";
    about1.lastName="Weiss";
    about1.ID=325063980;
    about1.image="<img id='myImg' src='images/about1.jpg'/>";
    about2.firstName="Reut";
    about2.lastName="Yacobovich";
    about2.ID=201056504;
    about2.image="<img id='myImg' src='images/about2.jpg'/>";
    about3.firstName="Chaya";
    about3.lastName="Maman";
    about3.ID=316288752;
    about3.image="<img id='myImg' src='images/about3.jpg'/>";
    about4.firstName="Sivan";
    about4.lastName="Saban";
    about4.ID=312116924;
    about4.image="<img id='myImg' src='images/about4.jpg'/>";

    aboutAll.push(about1,about2,about3,about4);

  }
  