class ReservatoionsCreator {
    #repository;

    constructor(repository) {
        this.#repository = repository;
    }

    execute(dto) {
        if(!dto) throw new Error(`dto cannot be null`);


    }
}

module.exports = ReservatoionsCreator;