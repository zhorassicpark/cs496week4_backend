const axios = require("axios");
const cheerio = require("cheerio");

export function getRegionData():object{
//   let data =[
//   {"state":"대전광역시","area":"서구","town":"용문동"},
//   {"state":"대전광역시","area":"서구","town":"탄방동"},
//   {"state":"대전광역시","area":"서구","town":"가장동"},
//   {"state":"대전광역시","area":"서구","town":"갈마동"},
//   {"state":"대전광역시","area":"서구","town":"둔산동"},
//   {"state":"대전광역시","area":"서구","town":"월평동"},
//   {"state":"대전광역시","area":"서구","town":"가수원동"},
//   {"state":"대전광역시","area":"서구","town":"도안동"},
//   {"state":"대전광역시","area":"서구","town":"관저동"},
//   {"state":"대전광역시","area":"서구","town":"흑석동"},
//   {"state":"대전광역시","area":"서구","town":"만년동"},
//   {"state":"대전광역시","area":"유성구","town":"봉명동"},
//   {"state":"대전광역시","area":"유성구","town":"구암동"},
//   {"state":"대전광역시","area":"유성구","town":"원신흥동"},
//   {"state":"대전광역시","area":"유성구","town":"죽동"},
//   {"state":"대전광역시","area":"유성구","town":"궁동"},
//   {"state":"대전광역시","area":"유성구","town":"어은동"},
//   {"state":"대전광역시","area":"유성구","town":"신성동"},
//   {"state":"대전광역시","area":"유성구","town":"도룡동"},
//   {"state":"대전광역시","area":"유성구","town":"관평동"},
//   {"state":"대전광역시","area":"유성구","town":"구룡동"},
//   {"state":"대전광역시","area":"대덕구","town":"오정동"},
//   {"state":"대전광역시","area":"대덕구","town":"송촌동"},
//   {"state":"대전광역시","area":"대덕구","town":"신탄진동"},
//   {"state":"대전광역시","area":"동구","town":"용계동"},
//   {"state":"대전광역시","area":"동구","town":"신흥동"},
//   {"state":"대전광역시","area":"동구","town":"판암동"},
//   {"state":"대전광역시","area":"동구","town":"신안동"},
//   {"state":"대전광역시","area":"중구","town":"은행동"},
//   {"state":"대전광역시","area":"중구","town":"목동"},
//   {"state":"대전광역시","area":"중구","town":"대흥동"},
//   {"state":"대전광역시","area":"중구","town":"용두동"},
//   {"state":"대전광역시","area":"중구","town":"태평동"},
//   ]

// let returnData = {};
// let prevState :string = "";
// let prevArea:string = "";
// data.forEach(element => {
//   if(element.state == prevState){
//     if(element.area == prevArea){
//       console.log(`same state and same area ! - town : ${element.area} | ${element.town}`);
//       returnData[prevState][prevArea].push(element.town);
//     }else{
//       console.log(`same state and new area ! - town : ${element.area} |  ${element.town}`);
//       returnData[prevState][element.area] = [];
//       returnData[prevState][element.area].push(element.town);
//       prevArea = element.area;
//     }
//   }else{
//     console.log(`new state and new area ! - town : ${element.area} |  ${element.town}`);
//     returnData[element.state] = {};
//     returnData[element.state][element.area] = [];
//     returnData[element.state][element.area].push(element.town);
//     prevArea = element.area;
//     prevState = element.state;
//   }
//   }
//   );

//   console.log(returnData);

const simplizedRegionData = {
  '대전광역시': {
    '서구': [
      '용문동',   '탄방동',
      '가장동',   '갈마동',
      '둔산동',   '월평동',
      '가수원동', '도안동',
      '관저동',   '흑석동',
      '만년동'
    ],
    '유성구': [
      '봉명동',   '구암동',
      '원신흥동', '죽동',
      '궁동',     '어은동',
      '신성동',   '도룡동',
      '관평동',   '구룡동'
    ],
    '대덕구': [ '오정동', '송촌동', '신탄진동' ],
    '동구': [ '용계동', '신흥동', '판암동', '신안동' ],
    '중구': [ '은행동', '목동', '대흥동', '용두동', '태평동' ]
  }
}
  return simplizedRegionData;
}


export async function getItemData(url : string){
  let ulList = [];
  const getHtml = async () => {
    try {
      return await axios.get(url);
    }catch(error){
      console.error(error);
    }
  }
  return getHtml()
  .then(html => {
    const $ = cheerio.load(html.data);
    const $bodyList = $("div.cunit_lst_v ul").children("li.cunit_t232");
    // console.log($bodyList);
    let j = 0;
    $bodyList.each(function(i, elem){
      if(j<25){
        ulList[i] = {
        name: $(this).find("em.tx_ko").text(),
        imgUrl: $(this).find("img").attr('src'),
        orgPrice: parseInt($(this).find("div.org_price em").text().replace(',','')),
        salePrice: parseInt($(this).find("div.opt_price em").text().replace(',','')),
        rate: parseFloat($(this).find("div.rating div span span").text().substring(3, 7))
        // dueDate: $(this).find("dt.image img")
      } 

      }
      j++;
    })
    let noNaNCount = 0;
    // const data = ulList.filter(n=>{
    //   if(!isNaN(n.orgPrice)){
    //     noNaNCount ++;
    //   }
    //   return (!isNaN(n.orgPrice));
    // });
    ulList.forEach((e)=>{
      if(isNaN(e.orgPrice)){
        console.log("NaN!");
        noNaNCount ++;
        e.orgPrice = Math.floor((((Math.random()*0.5)+1)*e.salePrice)/1000)*1000;
      }
    })

    // console.log(`Number of Sales product is ${noNaNCount}`);
    
    console.log(`Number of not Sales product is ${noNaNCount}`);
    return ulList;
  });
}