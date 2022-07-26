import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { UserService } from '../service/user.service';
// import { TestService } from '../test/test.service';
import { User } from '../domain/User';
import { userGen } from 'src/utils/dataFormater';
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
  ) {
    this.userService = userService;
  }

  @Get('list')  //  모든 유저의 목록 조회
  async findAll(): Promise<User[]> {
    // console.log("GET /user/list req rcvd");
    const userList = await this.userService.findAll();
    console.log(userList);
    return Object.assign({
      data: userList,
      statusCode: 200,
      statusMsg: `데이터 조회가 성공적으로 완료되었습니다.`,
    });
  }

  @Post() //  유저 회원가입
  async saveUser(@Body() body): Promise<string> {
    // console.log("POST /user req rcvd");

    if(await this.userService.findOne(body.id)){  //  기존에 있던 ID면 등록 거절
      return Object.assign({
        data: {...body },
        statusCode: 401,
        statusMsg: `이미 존재하는 ID입니다!`,
      });
    }
    //  기존에 없는 ID일 경우 회원 신규 등록 진행
    const user = userGen(body.id, body.password, body.name, false);
    await this.userService.saveUser(user);

    return Object.assign({
      data: {...user },
      statusCode: 201,
      statusMsg: `회원가입이 성공적으로 완료되었습니다.`,
    });
  }
  
  @Put()// 로그인작업
  async loginUser(@Body() body): Promise<string> {
    // console.log("login request arrived");
    console.log(body);
    if(body.isKakaoLogin == "true"){  //nestJs 특성상 body.isKakaoLogin 의 true/false data type이 꼬일 수 있다. 조심!!!!
      const kUser = await this.userService.findOne(body.id);
      if(kUser == null){  //  카카오가 유저가 기존에 없던 ID일 시, 신규등록과 로그인 동시 진행
        const nkUser = userGen(body.id, null, body.name, true);
        await this.userService.saveUser(nkUser);
        return Object.assign({
          data: {...nkUser },
          statusCode: 201,
          statusMsg: `신규 카카오 회원 등록 및 로그인 성공`,
        });
      }else{  //  카카오 유저가 기존에 존재하던 ID일 시, 정상로그인 진행
        kUser.isActive = true;
        await this.userService.saveUser(kUser);
        return Object.assign({
          data: {...kUser },
          statusCode: 201,
          statusMsg: `카카오 로그인 성공`,
        });
      }
    }else{  //  카카오 로그인이 아닐경우, 회원가입은 무조건 선행돼 있어야 한다.
      const user = await this.userService.findOne(body.id);
      if(!(user)){
        return Object.assign({
          data: {...body },
          statusCode: 401,
          statusMsg: `존재하지 않는 회원입니다!`,
        });
      }
      if((user.password !== body.password)){
        return Object.assign({
          data: {...body },
          statusCode: 401,
          statusMsg: `올바르지 않은 비밀번호입니다!`,
        });
      }
  
      user.isActive = true;
  
      await this.userService.saveUser(user);
      const response =  Object.assign({
        data: {
          ...user },
        statusCode: 201,
        statusMsg: `로그인 성공`,
      });
      console.log("Login Succeeded and response is : ");
      console.log(response);
      return response;
    }
  }

  @Put(':userId/logout')  // 로그아웃
  async logout(@Param('userId') userId: string, @Body() body): Promise<string>{
    // console.log("PUT user/:userId/logout req rcvd");
    console.log(userId);
    console.log(body);

    const user = await this.userService.findOne(userId);
    if(!user){ return Object.assign({
      data: {userId},
      statusCode: 404,
      statusMsg: '존재하지 않는 회원입니다.',
    })
    }
    user.isActive = false;
    await this.userService.saveUser(user);

    const response = Object.assign({
      data: {
        id : userId,
      },
      statusCode: 204,
      statusMsg: '로그아웃이 성공적으로 완료되었습니다.',
    })
    console.log("LOGOUT succeeded. response is : ");
    console.log(response);
    return response;
  }

  @Get(':userId') //회원정보 조회
  async findOne(@Param('userId') id: string, @Body() body): Promise<User> {
    // console.log("GET /user/:userId req rcvd");

    const foundUser = await this.userService.findOne(id);
    if(foundUser){
      return Object.assign({
        data: foundUser,
        statusCode: 400,
        statusMsg: `존재하지 않는 유저입니다.`,
      });
    }
    return Object.assign({
      data: foundUser,
      statusCode: 200,
      statusMsg: `데이터 조회가 성공적으로 완료되었습니다.`,
    });
  }

  @Delete(':userId')  //회원 탈퇴
  async deleteUser(@Param('userId') id: string, @Body() body): Promise<string> {
    // console.log("DEL /user/:userId req rcvd");

    const delUser = await this.userService.findOne(id);    
    if(!delUser){ 
      return Object.assign({
      data: { userId: id },
      statusCode: 400,
      statusMsg: `존재하지 않는 회원입니다.`,
    });
    }

    await this.userService.deleteUser(id);

    return Object.assign({
      data: { userId: id },
      statusCode: 201,
      statusMsg: `유저 정보가 성공적으로 삭제되었습니다.`,
    });
  }

  @Put(':userId/defRegion') //  유저의 동네 설정 - 회원가입 때 적는 정보가 아니라, 메인 페이지로 넘어가기 전 or 동네 변경시 작성한다.
  async setUsersDefaultRegion(@Param('userId') userId:string, @Body() body):Promise<void>{
    // console.log("PUT /user/:userId/defRegion req rcvd");

    const user = await this.userService.findOne(userId);
    if(user == null){
      return Object.assign({
        data: {userId},
        statusCode: 400,
        statusMsg: `수정하고자 하는 유저가 없습니다.`,
      });
    }
    user.defState = body.state;
    user.defArea = body.area;
    user.defTown = body.town;
    return Object.assign({
      data: {
        state: user.defState,
        area: user.defArea,
        town: user.defTown
      },
      statusCode: 204,
      statusMsg: `유저의 기본 지역정보가 성공적으로 갱신되었습니다.`,
    });
  }

  @Get(':userId/defRegion') //  유저의 동네설정 조회 - 메인페이지로 넘어갈 때, 이미 기존에 유저가 설정해논 지역정보가 있다면 이를 받아온다.
  async getUsersDefaultReginon(@Param('userId') userId:string):Promise<object>{
    // console.log("GET /user/:userId/defRegion req rcvd");

    const user = await this.userService.findOne(userId);
    if(user == null){
      return Object.assign({
        data: {userId},
        statusCode: 400,
        statusMsg: `조회하고자 하는 유저가 없습니다.`,
      });
    }
    return Object.assign({
      data: {
        state: user.defState,
        area: user.defArea,
        town: user.defTown
      },
      statusCode: 204,
      statusMsg: `유저의 기본 지역정보가 성공적으로 조회되었습니다.`,
    });
  }

  @Put(':userId/budget')  //  유저의 잔고를 갱신. 유저가 특정 상품의 공구에 참여 / 참여취소 시에 공구금액을 차감 / 추가 후 새로운 잔고를 갱신한다.
  async updateBudget(@Param('userId') userId:string, @Body() body):Promise<void>{
    // console.log("PUT /user/:userId/budget req rcvd");

    const user = await this.userService.findOne(userId);
    user.budget = body.newValue;
    await this.userService.saveUser(user);
    
    return Object.assign({
      data: {
        user
      },
      statusCode: 204,
      statusMsg: `유저의 자산 정보가 성공적으로 갱신되었습니다.`,
    });
  }
}