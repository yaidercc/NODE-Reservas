class UserCreator {
    #repository;
    constructor(repository) {
        this.#repository = repository;
    }
  async execute(dto) {
        await this.#repository.save(dto);
    }
}

module.exports = UserCreator;