import { Body, ConsoleLogger, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../domain/User';
import { ItemService } from 'src/service/item.service';
import { Item } from 'src/domain/Item';
import { JoinerService } from 'src/service/joiner.service';
import { LikerService } from 'src/service/liker.service';
import { Liker } from 'src/domain/Liker';
import { Joiner } from 'src/domain/Joiner';
import { getItemData, getRegionData } from 'src/utils/dataImporter';
import { gotterListFormat, itemFormat, itemFormatWithUserJoinLikeGot, itemListFilterWithSearchWord, itemListFormat, itemListFormatWithUsersJoinLikeGot } from 'src/utils/dataFormater';
import { GotterService } from 'src/service/gotter.service';
import { Gotter } from 'src/domain/Gotter';
@Controller('item')
export class ItemController {
  constructor(
    private userService: UserService,
    private itemService: ItemService,
    private joinerService: JoinerService,
    private likerService: LikerService,
    private gotterService: GotterService,
  ) {
    this.userService = userService;
    this.itemService = itemService;
    this.joinerService = joinerService;
    this.likerService = likerService;
    this.gotterService = gotterService;
  } 

  @Get('regionList')  //  대전광역시의 시군구 정보를 불러온다. 런칭된 앱에서는 쓸 일 없음
  async returnRegionList():Promise<void>{
    const regionData = getRegionData();
    return Object.assign({
      data: regionData,
      statusCode:200,
      statusMsg: '동네 정보가 성공적으로 조회되었습니다.'
    });
  }

  @Get('itemCrawl') //  대전광역시의 시군구 정보를 불러온 뒤, (위의 리퀘스트 추가실행 필요X) 더미 상품을들 '동'단위 별로 '카테고리'별로 25개씩 담는다. 런칭된 앱에서는 쓸 일 없음
  async itemCrawlFetch():Promise<void>{
    const regionList = getRegionData();
    const siteList = [
      ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095739","과일"],
      ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095740","채소"],
      ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095498","쌀잡곡견과"],
      ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095499","정육계란류"],
      ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095500","수산물건해산"],
      ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095501","우유유제품유아식"],
      ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095502","냉장냉동간편식"],
      ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095507","생수음료주류"],
      ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095503","밀키트김치반찬"],
      ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095508","커피원두차"],
      ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095504","라면면류즉석식품통조림"],
      ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095509","장류양념가루오일"],
      ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095505","과자시리얼빙과떡"],
      ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095506","베이커리잼샐러드"],
      ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095510","건강식품"],
      ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095511","친환경유기농"],
    ];
    for(let ele of siteList){
      await setTimeout(()=>console.log("waiting..."), 500);
      const url = ele[0];
      const category = ele[1];
      const data = await getItemData(url);
      for(let state in regionList){
        for(let area in regionList[state]){
          for(let town in regionList[state][area]){
            for(let element of data){
              const item: Item = new Item();
              const nowDate = new Date();
              item.name = element.name;
              item.rate = element.rate;
              item.orgPrice = element.orgPrice;
              item.salePrice = element.salePrice;
              item.minMan = Math.ceil(Math.random()*5);
              item.nowMan = 0;
              item.rateMan = 1;
              nowDate.setDate(nowDate.getDate() + Math.ceil(Math.random()*10));
              nowDate.setHours(0,0,0,0);  //  we don't need hh:mm:ss:msms info in this app
              item.dueDate = nowDate;
              item.imgUrl = element.imgUrl;
              item.category = category;
              item.state = state;
              item.area = area;
              item.town = regionList[state][area][town];
              await this.itemService.saveItem(item);
            }
            // data.forEach(async (e)=>{
            //   const item: Item = new Item();
            //   const nowDate = new Date();
            //   item.name = e.name;
            //   item.rate = e.rate;
            //   item.orgPrice = e.orgPrice;
            //   item.salePrice = e.salePrice;
            //   item.minMan = Math.floor(Math.random()*10);
            //   item.nowMan = 0;
            //   nowDate.setDate(nowDate.getDate() + Math.floor(Math.random()*10));
            //   nowDate.setHours(0,0,0,0);  //  we don't need hh:mm:ss:msms info in this app
            //   item.dueDate = nowDate;
            //   item.imgUrl = e.imgUrl;
            //   item.category = category;
            //   item.state = state;
            //   item.area = area;
            //   item.town = regionList[state][area][town];
            //   await this.itemService.saveItem(item);
            //   await setTimeout(()=>console.log("waiting..."), 2000);
            // })
          }
        }
      }
      console.log("Done!");
    }
    // siteList.forEach(async (e)=>{
    // })
  }

  @Get('list')                                                                      ////  지역고려X 모든 상품 내역을 불러온다. 런칭된 앱에서는 쓸 일 없음
  async findAll(): Promise<Item[]> {
    console.log('get item list');
    const itemList = await this.itemService.findAll();
    console.log(itemList);
    return Object.assign({
      data: itemList,
      statusCode: 200,
      statusMsg: `상품 목록 조회가 성공적으로 완료되었습니다.`,
    });
  }

  @Get('test')
  async testFunc():Promise<void>{
    const usersOngoingGroup = await this.joinerService.findWithUserCondition("jina0202"); 
  }


  /////////////////////////////////////////////////////////////////////////////
  /* 여기서부터 메인  비즈니스 로직. 위에는 앱에서 보낼 일이 없는 Req 이다. */
  ////////////////////////////////////////////////////////////////////////////


  @Get('list/:state/:area/:town')                                                                //  선택된 지역의 모든 상품 조회, 상품명 리스트와 함께 반환
  async findOne(@Param() param, @Body() body, @Query() query): Promise<Item[]> {
    const {state, area, town} = param;
    const userId = body.userId;
    if(await this.userService.findOne(userId) == null){
      return Object.assign({
        data:userId,
        statusCode: 400,
        statusMsg: '해당 ID의 회원은 존재하지 않습니다.'
      })
    }
    const foundItemList = await this.itemService.findWithRegionCondition(state, area, town);
    console.log(state, area, town);
    if(!foundItemList){
      return Object.assign({
        data: foundItemList,
        statusCode: 400,
        statusMsg: '해당 지역에 상품이 없습니다.',
      });
    }

    const usersJoinedGroup = await this.joinerService.findWithUserCondition(userId); 
    const usersLikedGroup = await this.likerService.findWithUserCondition(userId);
    const usersGottedGroup = await this.gotterService.findWithUserCondition(userId);
    let resultItemList = itemListFormatWithUsersJoinLikeGot(foundItemList, usersJoinedGroup, usersLikedGroup, usersGottedGroup);
    if(query.searchWord != null){ //  query에 searchWord가 포함되어 있을 시, 검색어를 필터링한 결과를 보낸다
      resultItemList = itemListFilterWithSearchWord(resultItemList, query.searchWord);
    }

    let foundNameList : string[] = [];  //  검색어자동완성 기능을 위한 NAME LIST 동봉 반환
    foundItemList.forEach(element => {
      foundNameList.push(element.name);
    });

    console.log("FOUND NAME LIST :");
    console.log(foundNameList);
    console.log("FOUND ITEM LIST");
    console.log(resultItemList);
    return Object.assign({
      data: {
        foundNameList,
        resultItemList
      },
      statusCode: 200,
      statusMsg: `상품 조회가 완료되었습니다.`,
    });
  }

  @Get('list/:state/:area/:town/:category')                                              //  선택된 지역의 특정 품목 모든 상품 조회, 상품명 리스트와 함께 반환
  async findWithRegionCategory(@Param() param, @Body() body, @Query() query): Promise<Item[]> {
    const {state, area, town, category} = param;
    const userId = body.userId;
    if(await this.userService.findOne(userId) == null){
      return Object.assign({
        data:userId,
        statusCode: 400,
        statusMsg: '해당 ID의 회원은 존재하지 않습니다.'
      })
    }
    const foundItemList = await this.itemService.findWithRegionCategoryCondition(state, area, town, category);
    console.log(state, area, town, category);
    if(!foundItemList){
      return Object.assign({
        data: foundItemList,
        statusCode: 400,
        statusMsg: '해당 지역 또는 품목에 상품이 없습니다.',
      });
    }

    const usersJoinedGroup = await this.joinerService.findWithUserCondition(userId); 
    const usersLikedGroup = await this.likerService.findWithUserCondition(userId);
    const usersGottedGroup = await this.gotterService.findWithUserCondition(userId);
    let resultItemList = itemListFormatWithUsersJoinLikeGot(foundItemList, usersJoinedGroup, usersLikedGroup, usersGottedGroup);
    if(query.searchWord != null){ //  query에 searchWord가 포함되어 있을 시, 검색어를 필터링한 결과를 보낸다
      resultItemList = itemListFilterWithSearchWord(resultItemList, query.searchWord);
    }

    let foundNameList : string[] = [];  //  검색어자동완성 기능을 위한 NAME LIST 동봉 반환
    foundItemList.forEach(element => {
      foundNameList.push(element.name);
    });

    return Object.assign({
      data: {
        foundNameList,
        resultItemList
      },
      statusCode: 200,
      statusMsg: `상품 조회가 완료되었습니다.`,
    });
  }

  @Get('/list/:userId/ongoing')                                                                       //  현재 유저가 참여중인 ongoing 상품을 조회
  async findUsersOngoingItems(@Param('userId') userId: string):Promise<Item[]>{
    if(await this.userService.findOne(userId) == null){
      return Object.assign({
        data:userId,
        statusCode: 400,
        statusMsg: '해당 ID의 회원은 존재하지 않습니다.'
      })
    }
    const usersOngoingGroup = await this.joinerService.findWithUserCondition(userId); //  유저가 참여한 적 있는 상품 목록 가져오기
    const usersOngoingItemList = [];
    for(let e of usersOngoingGroup){
      usersOngoingItemList.push(await this.itemService.findOne(e.item.id));
    }
    // const nowDate = new Date();
    // nowDate.setHours(0,0,0,0);
    // const usersOngoingItemList = [];
    // for(let e of usersOngoingGroup){    //  날짜를 비교하여 마감이 아직 안 된 상품만 필터링
    //   const candidateItem = await this.itemService.findOne(e.item.id);
    //   if(candidateItem.dueDate >= nowDate){
    //     usersOngoingItemList.push(candidateItem);
    //   }
    // }
    // usersOngoingGroup.forEach(async (e)=>{    //  날짜를 비교하여 마감이 아직 안 된 상품만 필터링
    //   const candidateItem = await this.itemService.findOne(e.item.id);
    //   if(candidateItem.dueDate >= nowDate){
    //     usersOngoingItemList.push(candidateItem);
    //   }
    // });
    const resultItemList = itemListFormat(usersOngoingItemList);
    return Object.assign({
      data: { usersOngoingItems:resultItemList },
      statusCode: 200,
      statusMsg: `유저의 관심 목록이 성공적으로 조회되었습니다.`,
    });
  }

  
  @Get('/list/:userId/previous')                                                                      //  유저가 참여했던 상품목록을 조회
  async findUsersPreviousItems(@Param('userId') userId: string):Promise<Item[]>{
    if(await this.userService.findOne(userId) == null){
      return Object.assign({
        data:userId,
        statusCode: 400,
        statusMsg: '해당 ID의 회원은 존재하지 않습니다.'
      })
    }
    const usersPrevGroup = await this.gotterService.findWithUserCondition(userId);  //  유저가 참여한 적 있는 상품 목록 가져오기
    console.log(usersPrevGroup);
    const usersPrevItemList = [];
    for (let e of usersPrevGroup){   //  날짜를 비교하여 마감이 이미 된 상품만 필터링
      usersPrevItemList.push(await this.itemService.findOne(e.item.id));
    }
    // const nowDate = new Date();
    // nowDate.setHours(0,0,0,0);
    // const usersPrevItemList = [];
    // for (let e of usersPrevGroup){   //  날짜를 비교하여 마감이 이미 된 상품만 필터링
    //   const candidateItem = await this.itemService.findOne(e.item.id);
    //   console.log("dueDate");
    //   console.log(candidateItem.dueDate);
    //   if(candidateItem.dueDate < nowDate){
    //     console.log(candidateItem);
    //     usersPrevItemList.push(candidateItem);
    //   }
    // }
    // usersPrevGroup.forEach(async (e)=>{   //  날짜를 비교하여 마감이 이미 된 상품만 필터링
    //   const candidateItem = await this.itemService.findOne(e.item.id);
    //   console.log("dueDate");
    //   console.log(candidateItem.dueDate);
    //   if(candidateItem.dueDate < nowDate){
    //     console.log(candidateItem);
    //     usersPrevItemList.push(candidateItem);
    //   }
    // })
    const resultItemList = itemListFormat(usersPrevItemList);
    const response =  Object.assign({
      data: resultItemList,
      statusCode: 200,
      statusMsg: `유저의 과거참여 목록이 성공적으로 조회되었습니다.`,
    });
    console.log("RESPONSE : ");
    console.log(response);
    return response;
  }

  @Get('/list/:userId/likers')                                                                          //  유저가 관심있는 목록을 조회
  async findLikedItems(@Param('userId') userId: string):Promise<Item[]>{
    if(await this.userService.findOne(userId) == null){
      return Object.assign({
        data:userId,
        statusCode: 400,
        statusMsg: '해당 ID의 회원은 존재하지 않습니다.'
      })
    }
    const usersLikedGroup : Liker[]= await this.likerService.findWithUserCondition(userId);
    const nowDate = new Date();
    nowDate.setHours(0,0,0,0);
    const usersLikedItemList = [];
    for(let e of usersLikedGroup){  //  날짜를 비교하여 마감이 아직 안 된 상품만 필터링
      const candidateItem = await this.itemService.findOne(e.item.id);
      if(candidateItem.dueDate >= nowDate){
        usersLikedItemList.push(candidateItem);
      }

    }
    // usersLikedGroup.forEach(async (e)=>{  //  날짜를 비교하여 마감이 아직 안 된 상품만 필터링
    //   const candidateItem = await this.itemService.findOne(e.item.id);
    //   if(candidateItem.dueDate >= nowDate){
    //     usersLikedItemList.push(candidateItem);
    //   }
    // });
    const resultItemList = itemListFormat(usersLikedItemList);
    return Object.assign({
      data: { usersLikedItem:resultItemList },
      statusCode: 200,
      statusMsg: `유저의 관심 목록이 성공적으로 조회되었습니다.`,
    });
  }

  @Get('/list/:itemId/reviews')                                                                           //  상품에 달린 평점 및 리뷰의 목록을 조회
  async findItemReviews(@Param('itemId') itemId: number):Promise<void>{
    if(await this.itemService.findOne(itemId) == null){
      return Object.assign({
        data:itemId,
        statusCode: 400,
        statusMsg: '해당 ID의 상품은 존재하지 않습니다.'
      })
    }
    let itemsGotterGroup : Gotter[]= await this.gotterService.findWithItemCondition(itemId);
    console.log("해당 상품의 구매이력 GOTTERLIST : ");
    console.log(itemsGotterGroup);
    const filteredGotterGroup = itemsGotterGroup.filter((e)=> {
      if(e.usersRate == null){
        console.log("아래의 Gotter는 rate : null 이라서 거르겠음!");
        console.log(e);
        return false;
      }else{
        console.log("아래의 Gotter는 rate 값 존재해서 포함하겠음!");
        console.log(e);
        return true;
      }
    });

    console.log("필터링 후 GotterList : ");
    console.log(filteredGotterGroup);
    const sortedGotterList = filteredGotterGroup.sort((a,b)=>((a.reviewDate < b.reviewDate)? 1:-1));
    console.log("날짜 내림차순 정렬 후 GotterList : ");
    console.log(sortedGotterList);
    console.log("데이터 포매팅 시작...");
    const resultReviewList = gotterListFormat(sortedGotterList);
    console.log("response로 보낼 준비(포맷팅) 완료");
    return Object.assign({
      data: { itemReviews:resultReviewList },
      statusCode: 200,
      statusMsg: `상품의 리뷰 목록이 성공적으로 조회되었습니다.`,
    });
  }
  
  @Get(':itemId')                                                                                           ////  특정 ID의 아이템 세부정보 로딩
  async findOneItem(@Param('itemId') itemId: number, @Query() query): Promise<Item> {
    console.log('get item with id : '+ itemId+' considering user: '+query.userId);
    const userId = query.userId;
    const item = await this.itemService.findOne(itemId);
    console.log(item);
    const usersJoinedGroup = await this.joinerService.findWithUserCondition(userId); 
    const usersLikedGroup = await this.likerService.findWithUserCondition(userId);
    console.log("userId ");
    console.log(userId);
    const usersGottedGroup = await this.gotterService.findWithUserCondition(userId);
    console.log("USER'S GOTTED GROUP");
    console.log(usersGottedGroup);
    const response = Object.assign({
      data: { 
        ...itemFormatWithUserJoinLikeGot(item, usersJoinedGroup, usersLikedGroup, usersGottedGroup)
      },
      statusCode: 200,
      statusMsg: `상품 조회가 성공적으로 완료되었습니다.`,
    });
    // console.log(response);

    return response;
  }

  @Put('/liker/:userId/:itemId')                                                                           //  유저가 상품에 누른 좋아요(관심)의 toggle
  async toggleUsersLikeItem(@Param() param):Promise<void>{
    const userId = param.userId;
    const itemId = param.itemId;
    if(await this.userService.findOne(userId) == null){
      return Object.assign({
        data:userId,
        statusCode: 400,
        statusMsg: '해당 ID의 회원은 존재하지 않습니다.'
      })
    }
    let nowLiked :boolean;
    const ifAlreadyLiked = await this.likerService.findWithUserItemCondition(userId, itemId);
    if(ifAlreadyLiked == null){
      console.log("원래는 좋아요 안 돼 있었으므로 좋아요 하겠음!!!");
      console.log(ifAlreadyLiked);
      const newLiker = new Liker();
      newLiker.user = await this.userService.findOne(userId);
      newLiker.item = await this.itemService.findOne(itemId);
      await this.likerService.saveLiker(newLiker);
      nowLiked = true;
    }else{
      console.log("이미 좋아요 있으므로 취소 하겠음!!!");
      console.log(ifAlreadyLiked);
      await this.likerService.deleteLiker(ifAlreadyLiked.id);
      nowLiked = false;
    }
    const response = Object.assign({
      data: { userId,
        itemId,
        nowLiked  },
      statusCode: 201,
      statusMsg: `유저의 관심여부 변경이 성공적으로 반영되었습니다.`,
    });
    console.log("RESPONSE :");
    console.log(response);
    return response;
  }

  @Put('/join/:userId/:itemId')                                                                           //  유저의 상품에 대한 참여여부의 toggle
  async toggleUsersJoinItem(@Param() param):Promise<void>{
    const userId = param.userId;
    const itemId = param.itemId;
    let toggleItem;
    let toggleUser;
    let nowJoined :boolean;
    const ifAlreadyJoined = await this.joinerService.findWithUserItemCondition(userId, itemId);
    if(ifAlreadyJoined == null){  //  아직 참여한 적 없으면, 참여 처리
      const newJoin = new Joiner();
      newJoin.user = await this.userService.findOne(userId);
      newJoin.item = await this.itemService.findOne(itemId);
      console.log(`new Join's Item is ${newJoin.item}`);
      console.log(newJoin.item);
      nowJoined = true;
      await this.joinerService.saveJoiner(newJoin);
      console.log(await this.joinerService.findWithUserItemCondition(userId, itemId));
      toggleItem = await this.itemService.findOne(itemId);
      toggleUser = await this.userService.findOne(userId);
      toggleItem.nowMan += 1;
      toggleUser.budget -= toggleItem.salePrice;
      await this.itemService.saveItem(toggleItem);
      await this.userService.saveUser(toggleUser);

      console.log("일단 공구참여는 시켰고, 이제 인원 확인할 거임. 이제 현재 인원 / 모집 인원 출력");
      console.log(toggleItem.nowMan, toggleItem.minMan);


      // 이렇게 참여 함으로써 상품의 공구 모집 인원이 꽉 찬다면, 공구를 완료 처리
      if(toggleItem.nowMan >= toggleItem.minMan){
        const completedJoinerList = await this.joinerService.findWithItemCondition(itemId);
        console.log("이 상품에 참여한 Joiner 목록을 확인해보겟슴....");
        console.log(completedJoinerList);

        console.log("공구 마감 시작...");
        for(let cJoiner of completedJoinerList){
          const cUserId = cJoiner.user.id;
          const cItemId = cJoiner.item.id;
          console.log("공구 취소될 구매자 / 취소될 상품");
          console.log(cUserId , cItemId);
          console.log("삭제될 Joiner의 JoinerID");
          console.log(cJoiner.id);
          await this.joinerService.deleteJoiner(cJoiner.id);
          console.log("해당 Joiner가 아직 남아있는지 확인");
          console.log(await this.joinerService.findOne(cJoiner.id));
          const newGotter = new Gotter();
          newGotter.user = await this.userService.findOne(cUserId);
          newGotter.item = await this.itemService.findOne(cItemId);
          newGotter.usersRate = null;
          await this.gotterService.saveGotter(newGotter);
          console.log("새로운 Gotter");
          console.log(newGotter);
        }
        nowJoined = false;
        console.log("공구 마감 전 상품의 상태");
        console.log(toggleItem);
        toggleItem = await this.itemService.findOne(itemId);
        toggleItem.nowMan = 0;
        await this.itemService.saveItem(toggleItem);
        console.log("공구 마감 후 상품의 상태");
        console.log(toggleItem);
        return Object.assign({
          data: { userId,
            itemId,
            nowJoined,
          nowBudget:toggleUser.budget,  },
          statusCode: 201,
          statusMsg: `유저가 공구에 참여함으로써 공구가 마감되었습니다. 상품은 다시 nowMan = 0 이 됩니다.`,
        });
      }
      return Object.assign({
        data: { userId,
          itemId,
          nowJoined,
          nowBudget:toggleUser.budget,  },
        statusCode: 201,
        statusMsg: `유저가 공구에 참여하였습니다. 원할 경우 참여 취소할 수 있습니다.`,
      });

    }else{          // 참여 했던 상품이면, 참여 취소 처리
      await this.joinerService.deleteJoiner(ifAlreadyJoined.id);
      toggleItem = await this.itemService.findOne(itemId);
      toggleUser = await this.userService.findOne(userId);
      nowJoined = false;
      toggleItem.nowMan -= 1;
      toggleUser.budget += toggleItem.salePrice;
      await this.itemService.saveItem(toggleItem);
      await this.userService.saveUser(toggleUser);
      return Object.assign({
        data: { userId,
          itemId,
          nowJoined,
          nowBudget:toggleUser.budget,  },
        statusCode: 201,
        statusMsg: `유저가 공구에 참여 취소하였습니다. 원할 경우 재참여 가능합니다.`,
      });
    }
    // await this.itemService.saveItem(toggleItem);
  }

  @Put('/rate/:itemId')                                                                            //  유저가 이미 구매 완료한 전적이 있는 상품에 평점 남기기
  async rateUsersGottedItem(@Param() param, @Query() query):Promise<void>{
    const userId = query.userId;
    const itemId = param.itemId;
    const usersNewRate :number= parseFloat(query.rate);
    const usersNewReview : string = query.review;
    console.log("QUERY.RATE is : ");
    console.log(query.rate);
    console.log(typeof(query.rate));
    console.log("USER'SNEWRATE : ");
    console.log(usersNewRate);
    console.log(typeof(usersNewRate));
    console.log("USER's NEW REVIEW : ");
    console.log(usersNewReview);

    let rateGotter = await this.gotterService.findWithUserItemCondition(userId, itemId);  //  유저가 해당 상품을 공구 완료했는지 gotter를 조회
    if(rateGotter == null){ //  유저가 해당 상품을 구매한 전적이 없을 경우 평점 기록 불가
      return Object.assign({
      data:userId,
      statusCode: 400,
      statusMsg: '해당 ID의 회원은 해당 상품을 구매한 적이 없습니다.'
    })}

    const rateItem = await this.itemService.findOne(itemId);
    console.log("상품의 기존 정보");
    console.log(rateItem);
    console.log("-----------------------------------------------------");

    if(rateGotter.usersRate == null){
      console.log(" 이 상품에 평점을 처음 남김");
      rateItem.rate = (((rateItem.rate * rateItem.rateMan) + usersNewRate) / (rateItem.rateMan + 1));
      console.log("갱신 연산 성공, 새로운 평균 rate: ");
      console.log(rateItem.rate);
      rateItem.rateMan += 1;
      console.log("RATE NUM OF ITEM 갱신됨.");
      rateGotter.usersRate = usersNewRate;
      rateGotter.usersReview = usersNewReview;
      rateGotter.reviewDate = new Date();
    }else{
      console.log(" 이 상품에 평점을 남긴 적이 있으므로 기존 평점을 갱신하겠음");
      rateItem.rate = (((rateItem.rate * rateItem.rateMan) - rateGotter.usersRate + usersNewRate) / rateItem.rateMan);
      rateGotter.usersRate = usersNewRate;
      rateGotter.usersReview = usersNewReview;
      rateGotter.reviewDate = new Date();
      console.log("rateMan은 유지! 갱신 연산 성공, 새로운 평균 rate: ");
      console.log(rateItem.rate);
    }

    console.log("rateItem save 직전! rateItem 내용 : ");
    console.log(rateItem);
    await this.itemService.saveItem(rateItem);
    console.log("rateItem save 직후! rateItem 내용 : (직전이랑 같음)");
    console.log(rateItem);

    console.log("Gotter에 새로운 정보를 담아 저장 시작...");
    await this.gotterService.saveGotter(rateGotter);
    console.log("Gotter에 새로운 정보를 담아 저장 완료...  Gotter 내용: ");
    console.log(rateGotter);
    const newAvgRate = rateItem.rate;
    console.log("return 직전");
    return Object.assign({
    data:{newAvgRate},
    statusCode: 201,
    statusMsg: '성공적으로 평점을 등록하였습니다.'
  });
  }

  
  @Post()                                                                                                             //  //임시로 아이템 추가하는 request
  async addItem(@Body() body):Promise<void>{
    const item = new Item();
    item.name = body.name;
    item.rate = body.rate;
    item.orgPrice = body.orgPrice;
    item.salePrice = body.salePrice;
    item.minMan = body.minMan;
    item.nowMan = 0
    const newDate = new Date(body.dueDate);
    newDate.setHours(0,0,0,0);
    item.dueDate = newDate;
    item.imgUrl = body.imgUrl;
    item.category = body.category;
    item.state = body.state;
    item.area = body.area;
    item.town = body.town;
    await this.itemService.saveItem(item);
    return Object.assign({
      data:item,
      statusCode: 201,
      statusMsg: `아이템이 성공적으로 추가되었습니다.`,
    });
  }
}