const myURL2 = "https://api.coingecko.com/api/v3/coins/"
let myCoins = [];
let dataTo = [];
let toggleCoins = [];
let myPoints = [];
let interval = false;
let thisDataTO = [];

let singleData = {
  type: "spline",
  xValueType: "dateTime",
  name: "",
  showInLegend: true,
  xValueFormatString: "hh:mm:ss TT",
  yValueFormatString: "#,##0 ",
  dataPoints: thisDataTO,
}

$(()=>{
  $.ajax({
    url: myURL2,
    success: (response) => { 
      console.log(response);
      myCoins=response;
      console.log(myCoins),
      home();
      },
    error: (error) => {
      console.log(error);
    },
  })});

  let AllInfo={
    image:"",
    usd:0,
    eur:0,
    ils:0
  }

  let point ={
    x: "",
    y: "" 
  }

  const moreInfo = (data)=>{//create an object with the required information to ease the process
    console.log(data.id);
    let myInfo={...AllInfo};
    myCoins.map((item)=>{
      if(item.id==data.id){
        myInfo.image=item.image.thumb;
        myInfo.usd=item.market_data.current_price.usd;
        myInfo.eur=item.market_data.current_price.eur;
        myInfo.ils=item.market_data.current_price.ils;
      }
    })
    //allCoinsObject.push(myInfo);
    console.log(myInfo);
    return myInfo;
    //$(`#${data.id}`).append(`<div class="card-info"><img src=${myInfo.image}/><p> USD: ${myInfo.usd} EUR: ${myInfo.eur} ILS: ${myInfo.ils} </p></div>`);
  };

  function addRemove(data){
    myCoins.map((item)=>{
      if(item.id == data.id){
        toggleCoins.push(item.symbol.toUpperCase());
      }
    })
    console.log(toggleCoins);
  }

  const home = ()=>{
    dataTo = [];
    (interval?clearInterval(interval):console.log("home"));
    interval = false;
    toggleCoins = [];
    $("#res").html("");
    myCoins.map((item)=>{
    let newInfo=moreInfo(item);
    $("#res").append(`<div class="card" >
          <label class="switch">
          <input type="checkbox" onclick=addRemove(${item.id})>
          <span class="slider round"></span>
          </label>
          <div class="card-body">
          <p>${item.symbol.toUpperCase()}</p>
          <p>${item.name}</p><br>
          <button class="btn btn-primary" onclick=hideShow(${item.id})>More Info</button></div><div/>
          <div class="card-info" id=${item.id} style="display:none;">
          <p id="info"><img src=${newInfo.image}/>&nbsp <span>USD:</span> ${newInfo.usd}$&nbsp <span>EUR:</span> ${newInfo.eur}&#8364 &nbsp <span>ILS:</span> ${newInfo.ils}&#8362 </p>
          </div>`);
    })};

  function hideShow(data){
    console.log(data.id);
    $(".card-info").closest(`div[id^=${data.id}]`).toggle();//go to the specific information div to show/hide
  }

  const myTitle = ()=>{
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

  
  const getLiveData = ()=>{
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
      },    
      error: (error) => {
        console.log(error);
      },
    })
  };

  const createPoint = (response, item) => {
    var myPoint = {...point};
    let time = new Date();
    myPoint.x = time.getTime();
    myPoint.y = response[item]["USD"];
    return myPoint;
  };

  const pushPoint = (myPoints, dataTo)  => {
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

  const addData = () => {
    toggleCoins.map((item)=>{
      let mySingleData = {...singleData};
      mySingleData.name = item,
      dataTo.push(mySingleData)
    })
    console.log(dataTo);
  };
  

  const live = ()=>{
      console.log(toggleCoins);      
      addData();
      interval = true;
      let myInterval = () => {setInterval(live2, 2000)};
      myInterval();
      // $("#res").CanvasJSChart(options);
      };

  const about = ()=>{};

  const search = ()=>{
    let isValid = false;
    myCoins.map((item)=>{
      if($("#toSearch").val()==item.name || $("#toSearch").val()==item.symbol.toUpperCase())
      {
          isValid=true;
          // $("#res").html("");
          $("#res").html(`<div class="card"><div class="card-body"><p>${item.symbol.toUpperCase()}</p>
          <p>${item.name}</p>
          <br><button class="btn btn-primary" id=${item.id} onclick=moreInfo(${item})>More Info</button></div><div/>`);
      }
    });
    isValid?console.log("valid"):$("#res").html("Coin not found");
  };
  












