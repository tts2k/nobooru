import axios from "axios";

const BaseUrl = process.env.BASE_URL;
const PostRoute = "/api/post";

const latest = async () => {
  return axios.get(`${BaseUrl}${PostRoute}/latest`);
}

const id = async (id) => {
  return axios.get(`${BaseUrl}${PostRoute}/${id}`);
}

const tags = async (tags) => {
  const query = tags.map(e => e.replace(" ", "_")).join("+");
  return axios.get(BaseUrl + PostRoute, { params: { tags: query }});
}

const remove = async (id) => {
  return axios.delete(BaseUrl + PostRoute, { data: { postId: id }});
}

export { latest, id, tags, create, remove }
