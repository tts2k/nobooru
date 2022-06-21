import client from "../axios"

const PostRoute = "/post";

const latest = async () => {
  return client.get(`${PostRoute}/latest`);
}

const id = async (id) => {
  return client.get(`${PostRoute}/${id}`);
}

const tags = async (tags) => {
  const query = tags.map(e => e.replace(" ", "_")).join("+");
  return client.get(PostRoute, { params: { tags: query }});
}

const remove = async (id) => {
  return client.delete(PostRoute, { data: { postId: id }});
}

const post = { latest, id, tags, remove }

export default post;
