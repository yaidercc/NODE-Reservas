import {KnexRoomRepository} from "../../core/rooms";
import {knexConfig} from "../knexfile";

describe('Rooms Integrations testss', () => {
    const repository  = new KnexRoomRepository(knexConfig);

    it('Should Create a room', async () => {

    })
});