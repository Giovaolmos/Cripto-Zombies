import { expect } from "chai";
import { ethers } from "hardhat";
import { ZombieFactory } from "../typechain-types";

describe("ZombieFactory", function () {
  let zombieFactory: ZombieFactory;

  beforeEach(async function () {
    const ZombieFactory = await ethers.getContractFactory("ZombieFactory");
    zombieFactory = await ZombieFactory.deploy();
  });

  describe("Creación de Zombies", function () {
    it("Debería crear un nuevo zombie con nombre y DNA", async function () {
      const [owner] = await ethers.getSigners();
      const tx = await zombieFactory.createRandomZombie("Zombie1");
      const receipt = await tx.wait(1);
      if (!receipt) throw new Error("No se recibió el receipt");

      const event = receipt.logs[0];
      const parsedLog = zombieFactory.interface.parseLog(event);

      expect(parsedLog?.args?.name).to.equal("Zombie1");
      expect(parsedLog?.args?.zombieId).to.equal(0);
      expect(parsedLog?.args?.dna).to.not.equal(0);

      // Verificamos el mapping zombieToOwner
      expect(await zombieFactory.zombieToOwner(0)).to.equal(owner.address);
      // Verificamos el contador de zombies del owner
      expect(await zombieFactory.ownerZombieCount(owner.address)).to.equal(1);
    });

    it("Debería generar DNA de 16 dígitos", async function () {
      const tx = await zombieFactory.createRandomZombie("Zombie1");
      const receipt = await tx.wait(1);
      if (!receipt) throw new Error("No se recibió el receipt");

      const event = receipt.logs[0];
      const parsedLog = zombieFactory.interface.parseLog(event);
      const dna = parsedLog?.args.dna;

      expect(dna.toString()).to.match(/^\d{16}$/);
    });

    it("Debería emitir el evento NewZombie", async function () {
      const tx = await zombieFactory.createRandomZombie("Zombie1");
      const receipt = await tx.wait(1);
      if (!receipt) throw new Error("No se recibió el receipt");

      const event = receipt.logs[0];
      const parsedLog = zombieFactory.interface.parseLog(event);

      expect(parsedLog?.args?.zombieId).to.equal(0);
      expect(parsedLog?.args?.name).to.equal("Zombie1");
      expect(parsedLog?.args?.dna).to.not.equal(0);
    });

    it("Debería almacenar el zombie en el array", async function () {
      await zombieFactory.createRandomZombie("Zombie1");
      const zombie = await zombieFactory.zombies(0);

      expect(zombie.name).to.equal("Zombie1");
      expect(zombie.dna.toString()).to.match(/^\d{16}$/);
    });
  });
});
