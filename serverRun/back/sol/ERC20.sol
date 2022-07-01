// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZeppelinTestToken is ERC20, Ownable {
  constructor() ERC20("ZeppelinTestToken", "ZTT") {}

  // 새로 생성한 함수 (이전과 달리 배포시 민팅하는 토큰이 없고, 요건이 충족될때마다 새로 민팅해서 토큰을 지급하는 함수)
  // NFT 구매를 위해 민팅하는 시점에 approve를 설정하여 transferFrom 함수 실행을 가능하게 한다.
  function mintTokens(address[] calldata toArr, uint256[] memory amount)
    public
    onlyOwner
    returns (bool)
  {
    for (uint256 i = 0; i < toArr.length; i++) {
      require(toArr[i] != address(0x0));
      require(amount[i] > 0);
      _mint(toArr[i], amount[i] * 1e18);
      _approve(
        toArr[i],
        msg.sender,
        allowance(toArr[i], msg.sender) + amount[i] * 1e18
      );
    }
    return true;
  }

  // nft구매를 위해선 transferFrom 함수를 override하여 수정해줘야함
  // address spender = msg.sender 였는데, 그렇게하면 spender에 ERC-721 함수의 address가 들어가서 spendAllowance 함수에서 오류가 발생한다.
  function transferFrom(
    address from,
    address to,
    uint256 amount
  ) public virtual override returns (bool) {
    address spender = to;
    _spendAllowance(from, spender, amount);
    _transfer(from, to, amount);
    return true;
  }

  // 이전에 사용하던 방식 (정해진 개수를 민팅해놓고 요건이 충족되면 토큰을 지급해주는 방식)
  // // address로 이루어진 배열을 받아 각자 할당된 amount만큼 한번에 토큰을 지급하는 함수
  // function transferMany(address[] calldata toArr, uint256[] calldata amountArr)
  //   public
  // {
  //   for (uint256 i = 0; i < toArr.length; i++) {
  //     _transfer(msg.sender, toArr[i], amountArr[i]);
  //     emit Transfer(msg.sender, toArr[i], amountArr[i]);
  //   }
  // }
}
