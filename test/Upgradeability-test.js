const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Upgradeability proxy pattern", function () {
  let deployer, user 

  beforeEach ( async () => {
    [deployer, user] = await ethers.getSigners();

    const LogicV1 = await ethers.getContractFactory("LogicV1",deployer);
    this.logicV1  = await LogicV1.deploy();

    const Proxy = await ethers.getContractFactory("Proxy",deployer);
    this.proxy  = await Proxy.deploy(this.logicV1.address);

    const LogicV2 = await ethers.getContractFactory("LogicV2",deployer);
    this.logicV2  = await LogicV2.deploy(); 

    this.proxyPattern = await ethers.getContractAt("LogicV1",this.proxy.address)
  
  })

    describe('Proxy', () => { 
      it("should return the addres of when calling logicContract ",async () => {
        expect(await this.proxy.logicContract()).to.eq(this.logicV1.address);
      })
      it("should return the addres of when calling logicContract ",async () => {
       await expect(this.proxy.connect(user).upgrade(this.logicV2.address)).to.be.rejectedWith("Access restricted");
      })
      it("should allow the owner to upgrade logicContract ",async () => {
        await this.proxy.upgrade(this.logicV2.address)
        expect(await this.proxy.logicContract()).to.eq(this.logicV2.address);
       })
     })

  })

  
