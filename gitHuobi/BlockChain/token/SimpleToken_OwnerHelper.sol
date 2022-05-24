// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.14;

interface ERC20Interface {
    function totalSupply() external view returns (uint);
    function balanceOf(address account) external view returns (uint);
    function transfer(address recipient, uint amount) external returns(bool);
    function approve(address spender, uint amount) external returns(bool);
    function allowance(address owner, address spender) external view returns(uint);
    function transferFrom(address sender, address recipient, uint amount) external returns(bool);

    event Transfer(address indexed from, address indexed to, uint amount);
    event Transfer(address indexed spender, address indexed from, address indexed to, uint amount);
    event Approval(address indexed owner, address indexed spender, uint oldAmount, uint amount);
}

library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        uint c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a / b;
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert (b <= a);
        return a-b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert (c >= a);
        return c;
    }
}

abstract contract OwnerHelper {
    address private _owner;

    event OwnershipTransferred(address indexed preOwner, address indexed nextOwner);

    modifier onlyOwner {
        require(msg.sender == _owner, "OwnerHelper: caller is not owner");
        _;
    }

    constructor() {
        _owner = msg.sender;
    }

    function owner() public view virtual returns(address) {
        return _owner;
    }
    
    // vote라는 함수를 만들어서 address를 넣고 실행하면 address => uint mapping의 해당 address의 uint가 1 증가한다.
    // 후보로 나온 address의 value 값에 해당하는 uint가 전체 투표 카운트의 절반이상이면 _owner가 아래 할수를 실행할 수 있도록 require한다.
    function transferOwnership(address newOwner) onlyOwner public {
        require(newOwner != _owner);
        require(newOwner != address(0x0));
        address preOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(preOwner, newOwner);
    }
}

contract SimpleToken is ERC20Interface, OwnerHelper {
    using SafeMath for uint256;

    mapping (address => uint) private _balances;
    mapping (address => mapping (address => uint)) public _allowances;
    mapping (address => bool) public _personalTokenLock;

    bool public _tokenLock;
    uint public _totalSupply;
    string public _name;
    string public _symbol;
    uint8 public _decimals;
    uint private E18 = 1000000000000000000;

    constructor (string memory getName, string memory getSymbol) {
        _name = getName;
        _symbol = getSymbol;
        _decimals = 18;
        _totalSupply = 100000000 * E18;
        _balances[msg.sender] = _totalSupply;
        _tokenLock = true;
    }

    function isTokenLock(address from, address to) public view returns(bool lock) {
        lock = false;

        if(_tokenLock == true) {
            lock = true;
        }
        if(_personalTokenLock[from] == true || _personalTokenLock[to] == true ) {
            lock = true;
        }
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() external view virtual override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view virtual override returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint amount) public virtual override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) external view override returns(uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint amount) external virtual override returns(bool) {
        uint256 currentAllowance = _allowances[msg.sender][spender];
        // 아래에서 require(_balances[msg.sender] - _allowances[msg.sender][spender] >= amount) 이 되어야하는게 아닌가? (아니면 다른사람들에게도 approve해준 것 까지 합친 총량)
        // balance와만 비교해서는 다른 어떤 사람에게 approve 권한을 주었는지 알 수 없기 때문이다.
        require(_balances[msg.sender] >= amount, "ERC20: The amount to be transferred exceeds the amount of tokens held by the owner");
        _approve(msg.sender, spender, currentAllowance, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint amount) external virtual override returns(bool) {
        _transfer(sender, recipient, amount);
        emit Transfer(msg.sender, sender, recipient, amount);
        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        _approve(sender, msg.sender, currentAllowance, currentAllowance.sub(amount));
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal virtual {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer from the zero address");
        require(isTokenLock(sender, recipient) == false, "TokenLock : invalid token transfer" );
        uint senderBalance = _balances[sender];
        require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
        _balances[sender] = senderBalance.sub(amount);
        _balances[recipient] = _balances[recipient].add(amount);
    }

    function _approve(address owner, address spender, uint256 currentAmount, uint256 amount) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve from the zero address");
        require(currentAmount == _allowances[owner][spender], "ERC20: invalid currentAmount");
        emit Approval(owner, spender, currentAmount, amount);
    }

    function removeTokenLock() onlyOwner public {
        require(_tokenLock == true);
        _tokenLock = false;
    }

    //재사용가능하도록 수정
    function changePersonalTokenLockStatus(address _who) onlyOwner public {
        if (_personalTokenLock[_who] == true){
            _personalTokenLock[_who] = false;
        } else if (_personalTokenLock[_who] == false) {
            _personalTokenLock[_who] = true;
        }
    }

}