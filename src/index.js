const app = require("express")();

const faunadb = require("faunadb");
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

const {
  Ref,
  Paginate,
  Get,
  Match,
  Index,
  Map,
  Create,
  Collection,
  Documents,
  Lambda,
  Var,
  Join,
  Call,
  Function: Fn,
} = faunadb.query;

app.get("/slowblogposts", async (req, res) => {
  const doc = await client.query(
    Map(
      Paginate(Match(Index("blogposts"))),
      Lambda(["title", "description", "created_at", "read_time"], {
        title: Var("title"),
        description: Var("description"),
        created_at: Var("created_at"),
        read_time: Var("read_time")
      }
    ))
  );
  
  res.send(doc);
});

app.get("/blogposts", async (req, res) => {
  const doc = await client.query(
    Map(
      Paginate(Match(Index("blogposts"))),
      Lambda(["title", "description", "created_at", "read_time", "slug"], {
        title: Var("title"),
        description: Var("description"),
        created_at: Var("created_at"),
        read_time: Var("read_time"),
        slug: Var("slug")
      }
    ))
  );
  
  res.send(doc);
});

app.get("/getByRef", async (req, res) => {
  const doc = await client.query(
    Get(Ref(Collection('blogposts'), '286871878097699333'))
  );
  
  res.send(doc);
});

app.get("/getBySlug", async (req, res) => {
  const doc = await client.query(
    Get(Match(Index('blogpost_by_slug'), req.query.slug))
  );
  
  res.send(doc);
});


app.listen(5000, () => console.log("API on http://localhost:5000"));
