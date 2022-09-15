const myURL = "https://api.coingecko.com/api/v3/coins/list"
const myURL2 = "https://api.coingecko.com/api/v3/coins/"
const myCoins = [];

$(()=>{
  $.ajax({
    url: myURL,
    success: (response) => {
        i=0;
        while(i<10) {
            myCoins.push(response[i]["id"]);
            i+=1;
        };
        // to limit API 
    //   response.map((item)=>{myCoins.push(item.id)});
      console.log(myCoins);
      home();
      },
    error: (error) => {
      console.log(error);
    },
  })});


  const moreInfo = (data)=>{};

  const home = ()=>{
    $("#res").html("");
    myCoins.map((item)=>{
      $.ajax({
          url: myURL2+item,
          success: (response)=>{
          console.log(response);
          $("#res").append(`<div class="card"><div class="card-body"><p>${response.symbol}</p>
                          <p>${response.name}</p><br>
                          <button class="btn btn-primary" id=${response.id} onclick=moreInfo(${response})>More Info</button></div><div/>`);
          },
          error: (error)=>{console.log(error);},
    });});
  };

  const live = ()=>{};

  const about = ()=>{};

  const search = ()=>{};












