import { Application, Router } from "https://deno.land/x/oak/mod.ts";

interface Pokemon {
  name: string;
  num: number;
  type: string;
}

let pokemons: Array<Pokemon> = [
  {
    name: "Bulbasaur",
    num: 1,
    type: "plant",
  },
  {
    name: "Ivysaur",
    num: 2,
    type: "plant",
  },
  {
    name: "Venusaur",
    num: 3,
    type: "plant",
  },
];

const env = Deno.env.toObject();
const PORT = env.PORT || 4000;
const HOST = env.HOST || "127.0.0.1";

export const getPokemon = ({
  params,
  response,
}: {
  params: { name: string };
  response: any;
}) => {
  const pokemon = pokemons.filter((pokemon) => pokemon.name === params.name);
  if (pokemon.length) {
    response.status = 200;
    response.body = pokemon[0];
    return;
  }

  response.status = 400;
  response.body = { msg: `Cannot find dog ${params.name}` };
};
export const addPokemon = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  const body = await request.body();
  const pokemon: Pokemon = body.value;

  pokemons.push(pokemon);

  response.body = { msg: "OK" };
  response.status = 200;
};

export const getPokemons = ({ response }: { response: any }) => {
  response.body = pokemons;
};

const router = new Router();

router
  .get("/pokemons", getPokemons)
  .get("/pokemons/:name", getPokemon)
  .post("/pokemons", addPokemon);
// .put("/pokemons/:name", updatePokemon)
// .delete("/pokemons/:name", removePokemon);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Listening on port ${PORT}...`);

await app.listen(`${HOST}:${PORT}`);
