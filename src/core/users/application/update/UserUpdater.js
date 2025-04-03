const DomainUserFinder = require("../../domain/UserFinder");
const valueObjectEmail = require("../../domain/valueObjects/valueObjectEmail");

class UserUpdater {
    #repository;
    #finder;

    constructor(repository) {
        this.#repository = repository;
        this.#finder = new DomainUserFinder(repository);
    }
   async execute(id, dto) {
        if(!dto) throw new Error("dto cannot be null")

        const user = await this.#finder.execute(id);
        if(!user) throw new Error("user not exists")

       if (dto?.email){
           const existsEmail = await this.#repository.find(new valueObjectEmail(dto.email));
           if (existsEmail && existsEmail.id.value !== id) {
               throw new Error(`Email already exists`);
           }
       }

        user.update(dto);

        await this.#repository.update(user);


    }
}

module.exports = UserUpdater;