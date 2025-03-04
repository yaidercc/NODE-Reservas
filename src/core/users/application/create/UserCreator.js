class UserCreator {
    #repository;
    constructor(repository) {
        this.#repository = repository;
    }
  async execute(dto) {
        await this.#repository.insert(dto);
    }
}

module.exports = UserCreator;