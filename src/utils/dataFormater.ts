import { Gotter } from "src/domain/Gotter";
import { Item } from "src/domain/Item";
import { Joiner } from "src/domain/Joiner";
import { Liker } from "src/domain/Liker";
import { User } from "src/domain/User";

export function userGen(id:string, pw:string, name: string, iskakao:boolean):User{
  const user = new User();
  user.id = id;
  user.name = name;
  user.password = pw;
  if(iskakao){
    user.isActive = false;
  }else{
    user.isActive = true;
  }
  user.budget = 0;
  user.iskakao = iskakao;
  return user;
}

export function itemListFormat(itemList: Item[]):object[]{
  const resultItemList = itemList.map((e)=>{
    const date = e.dueDate;
    const newDueDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return {
      id:e.id,
      name:e.name,
      rate:e.rate,
      orgPrice:e.orgPrice,
      salePrice:e.salePrice,
      minMan:e.minMan,
      nowMan:e.nowMan,
      dueDate:newDueDate,
      imgUrl:e.imgUrl,
      category:e.category,
      state:e.state,
      area:e.area,
      town:e.town,
      likes:e.likers,
      joiners:e.joiners
    }
  });
  return resultItemList;
}

export function itemFormat(e: Item):object{
  const date = e.dueDate;
  const newDueDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const resultItem = {
    id:e.id,
    name:e.name,
    rate:e.rate,
    orgPrice:e.orgPrice,
    salePrice:e.salePrice,
    minMan:e.minMan,
    nowMan:e.nowMan,
    dueDate:newDueDate,
    imgUrl:e.imgUrl,
    category:e.category,
    state:e.state,
    area:e.area,
    town:e.town,
    likes:e.likers,
    joiners:e.joiners
  };
  return resultItem;
}

export function itemListFormatWithUsersJoinLikeGot(itemList:Item[], joinedList:Joiner[], likedList:Liker[], gottedList: Gotter[]):object[]{
  const joinedIdList = joinedList.map((e)=>{
    return e.item.id;
  });
  const gottedIdList = gottedList.map((e)=>{
    return e.item.id;
  });
  const likedIdList = likedList.map((e)=>{
    return e.item.id;
  });
  const resultItemList = itemList.map((e)=>{
    const date = e.dueDate;
    const newDueDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const result = {
      id:e.id,
      name:e.name,
      rate:e.rate,
      orgPrice:e.orgPrice,
      salePrice:e.salePrice,
      minMan:e.minMan,
      nowMan:e.nowMan,
      dueDate:newDueDate,
      imgUrl:e.imgUrl,
      category:e.category,
      state:e.state,
      area:e.area,
      town:e.town,
      likes:e.likers,
      joiners:e.joiners,
      userJoinedIt: false,
      userGotIt: false,
      userLikedIt: false,
    }
    if(joinedIdList.includes(e.id)){
      result.userJoinedIt = true;
    }
    if(gottedIdList.includes(e.id)){
      result.userGotIt = true;
    }
    if(likedIdList.includes(e.id)){
      result.userLikedIt = true;
    }
    return result;
  });
  return resultItemList;
  };

  export function itemFormatWithUserJoinLikeGot(e: Item, joinedList:Joiner[], likedList:Liker[], gottedList: Gotter[]):object{
    const joinedIdList = joinedList.map((e)=>{
      return e.item.id;
    });
    const gottedIdList = gottedList.map((e)=>{
      return e.item.id;
    });
    console.log("gottedIdList is...");
    console.log(gottedIdList);
    // console.log("joinedIdList is ...");
    // console.log(joinedIdList);
    const likedIdList = likedList.map((e)=>{
      return e.item.id;
    });
    // console.log("likedIdList is...");
    // console.log(likedIdList);
    const date = e.dueDate;
    const newDueDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const resultItem = {
      id:e.id,
      name:e.name,
      rate:e.rate,
      orgPrice:e.orgPrice,
      salePrice:e.salePrice,
      minMan:e.minMan,
      nowMan:e.nowMan,
      dueDate:newDueDate,
      imgUrl:e.imgUrl,
      category:e.category,
      state:e.state,
      area:e.area,
      town:e.town,
      likes:e.likers,
      joiners:e.joiners,
      userJoinedIt: false,
      userGotIt: false,
      userLikedIt: false,
      usersRate: null,
    };
    if(joinedIdList.includes(e.id)){
      resultItem.userJoinedIt = true;
    }
    console.log("item's id : ");
    console.log(e.id);
    if(gottedIdList.includes(e.id)){
      console.log("THE USER HAS ALREADY GOT THIS ITEM");
      console.log(resultItem);
      resultItem.userGotIt = true;
      resultItem.usersRate = gottedList[gottedIdList.indexOf(e.id)].usersRate;
    }
    if(likedIdList.includes(e.id)){
      console.log("user Liked It!");
      resultItem.userLikedIt = true;
    }
    // console.log("resultItem is : ");
    // console.log(resultItem);
    return resultItem;
  }

  export function itemListFilterWithSearchWord(itemList, searchWord:string):object[]{
    const resultItemList = itemList.filter((e)=>{
      return ((e.name).includes(searchWord));
    });
    return resultItemList;
  }

  export function gotterListFormat(gotterList: Gotter[]):object[]{
    console.log("여기부터 gotterListFormat 함수!");
    const resultReviewList = gotterList.map((e)=>{
      const date = e.reviewDate;
      const newDueDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      return {
        id:e.id,
        userId:e.user.id,
        usersRate: e.usersRate,
        usersReview: e.usersReview,
        usersReviewDate : newDueDate,
      }
    });
    console.log("포맷팅 후 resultReviewList : ");
    console.log(resultReviewList);
    console.log("여기까지 gotterListFormat 함수!");
    return resultReviewList;
  }