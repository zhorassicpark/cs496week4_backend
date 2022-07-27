import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { UserService } from '../service/user.service';
// import { TestService } from '../test/test.service';
import { User } from '../domain/User';
import { UserDto } from 'src/dto/UserDto';
import { FormatService } from 'src/service/format.service';
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private formatService: FormatService,
  ) {
    this.userService = userService;
  }

  @Get('list')  //  모든 유저의 목록 조회
  async findAll(): Promise<UserDto[]> {
    // console.log("GET /user/list req rcvd");
    const userList = await this.userService.findAll();
    const userDtoList :UserDto[] = await this.formatService.userListToUserDtoList(userList);
    console.log(userList);
    return Object.assign({
      data: userDtoList,
      statusCode: 200,
      statusMsg: `데이터 조회가 성공적으로 완료되었습니다.`,
    });
  }

  @Post() //  유저 회원가입
  async saveUser(@Body() body): Promise<void> {
    // console.log("POST /user req rcvd");

    if(await this.userService.findOne(body.userEmail)){  //  기존에 있던 ID면 등록 거절
      throw new HttpException('이미 존재하는 ID입니다!', HttpStatus.BAD_REQUEST);
      return Object.assign({
        data: {...body },
        statusCode: 401,
        statusMsg: `이미 존재하는 ID입니다!`,
      });
    }
    //  기존에 없는 ID일 경우 회원 신규 등록 진행
    const user = await this.formatService.userGen(body.userEmail, body.password, body.userName, false);
    await this.userService.saveUser(user);
    const userDto: UserDto = await this.formatService.userToUserDto(user);

    return Object.assign({
      data: {...userDto },
      statusCode: 201,
      statusMsg: `회원가입이 성공적으로 완료되었습니다.`,
    });
  }
  
  @Put()// 로그인작업
  async loginUser(@Body() body): Promise<void> {
    // console.log("login request arrived");
    console.log(body);
    if(body.isKakaoLogin == "true"){  //nestJs 특성상 body.isKakaoLogin 의 true/false data type이 꼬일 수 있다. 조심!!!!
      const kUser = await this.userService.findOne(body.id);
      if(kUser == null){  //  카카오가 유저가 기존에 없던 ID일 시, 신규등록과 로그인 동시 진행
        const nkUser = await this.formatService.userGen(body.id, null, body.name, true);
        await this.userService.saveUser(nkUser);
        const nkUserDto : UserDto = await this.formatService.userToUserDto(nkUser);
        return Object.assign({
          data: {...nkUserDto },
          statusCode: 201,
          statusMsg: `신규 카카오 회원 등록 및 로그인 성공`,
        });
      }else{  //  카카오 유저가 기존에 존재하던 ID일 시, 정상로그인 진행
        kUser.isActive = true;
        await this.userService.saveUser(kUser);
        const kUserDto :UserDto = await this.formatService.userToUserDto(kUser);
        return Object.assign({
          data: {...kUserDto },
          statusCode: 201,
          statusMsg: `카카오 로그인 성공`,
        });
      }
    }else{  //  카카오 로그인이 아닐경우, 회원가입은 무조건 선행돼 있어야 한다.
      const user = await this.userService.findOne(body.userEmail);
      if(!(user)){
        throw new HttpException('존재하지 않는 회원입니다!', HttpStatus.BAD_REQUEST);
        // return Object.assign({
        //   data: {...body },
        //   statusCode: 401,
        //   statusMsg: `존재하지 않는 회원입니다!`,
        // });
      }
      if((user.password !== body.password)){
        throw new HttpException('올바르지 않은 비밀번호입니다!', HttpStatus.BAD_REQUEST);
        // return Object.assign({
        //   data: {...body },
        //   statusCode: 401,
        //   statusMsg: `올바르지 않은 비밀번호입니다!`,
        // });
      }
  
      user.isActive = true;
  
      await this.userService.saveUser(user);
      const userDto :UserDto = await this.formatService.userToUserDto(user);
      const response =  Object.assign({
        data: {
          ...userDto },
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
    if(!user){ 
      throw new HttpException('존재하지 않는 회원입니다.', HttpStatus.BAD_REQUEST);
      return Object.assign({
      data: {userId},
      statusCode: 401,
      statusMsg: '존재하지 않는 회원입니다.',
    })
    }
    user.isActive = false;
    await this.userService.saveUser(user);
    const userDto :UserDto = await this.formatService.userToUserDto(user);

    const response = Object.assign({
      data: {
        ...userDto
      },
      statusCode: 201,
      statusMsg: '로그아웃이 성공적으로 완료되었습니다.',
    })
    console.log("LOGOUT succeeded. response is : ");
    console.log(response);
    return response;
  }

  @Get(':userId') //회원정보 조회
  async findOne(@Param('userId') id: string, @Body() body): Promise<void> {
    // console.log("GET /user/:userId req rcvd");

    const foundUser = await this.userService.findOne(id);
    if(!foundUser){
      throw new HttpException('존재하지 않는 회원입니다.', HttpStatus.BAD_REQUEST);
      return Object.assign({
        data: {},
        statusCode: 400,
        statusMsg: `존재하지 않는 유저입니다.`,
      });
    }
    const foundUserDto : UserDto = await this.formatService.userToUserDto(foundUser);
    return Object.assign({
      data: foundUserDto,
      statusCode: 200,
      statusMsg: `데이터 조회가 성공적으로 완료되었습니다.`,
    });
  }

  @Delete(':userId')  //회원 탈퇴
  async deleteUser(@Param('userId') id: string, @Body() body): Promise<string> {
    // console.log("DEL /user/:userId req rcvd");

    const delUser = await this.userService.findOne(id);    
    if(!delUser){ 
      throw new HttpException('존재하지 않는 회원입니다.', HttpStatus.BAD_REQUEST);
      return Object.assign({
      data: { userId: id },
      statusCode: 404,
      statusMsg: `존재하지 않는 회원입니다.`,
    });
    }
    const delUserDto : UserDto = await this.formatService.userToUserDto(delUser);

    await this.userService.deleteUser(id);

    return Object.assign({
      data: delUserDto,
      statusCode: 204,
      statusMsg: `유저 정보가 성공적으로 삭제되었습니다.`,
    });
  }
}