const myURL2 = "https://api.coingecko.com/api/v3/coins/"
let myCoins = [];
let dataTo = [];
let toggleCoins = [];
let myPoints = [];
let interval = false;
let thisDataTO = [];


let singleData = {//data structure for single coin to the graph
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

  let point ={//create a data structure to point object to the graph
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


  const choice = ()  => {
    $("#toChoice").html("");
    myCoins.map((item)=>{
      if(toggleCoins.includes(item.symbol.toUpperCase())){
    $("#toChoice").append(`<div class="card">
          <label class="switch">
          <input type="checkbox" class="check" id=(${item.symbol.toUpperCase()}) onclick=addRemove(${item.id})>
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


//   // When the user clicks on <span> (x), close the modal
// $("#close").click(function() {
//   $("#myModal").css("display","none");
// })

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

  const home = ()=>{
    dataTo = [];
    const stopInterval = () => clearInterval(myInter);
    (interval?stopInterval():console.log("home"));
    interval = false;
    toggleCoins = [];
    $("#res").html("");
    myCoins.map((item)=>{
    let newInfo=moreInfo(item);
    $("#res").append(`<div class="card" >
          <label class="switch">
          <input type="checkbox" class="check1" id=(${item.id}) onclick=addRemove(${item.id})>
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
      console.log(toggleCoins);      
      addData();
      interval = true;
      const myInterval = () => myInter = setInterval(live2, 2000);
      // const stopInterval = () => clearInterval(myInter);
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
  












