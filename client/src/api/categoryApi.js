import axiosClient from "./axiosClient";

const apiUrl = "/categories";

const categoryApi = {
  fetchList(params) {
    const { key, parent, status, _page, _limit } = params;

    // Url
    let url = apiUrl;

    if (key) url += `&key=${key}`;
    if (parent) url += `&parent=${parent}`;
    if (status !== undefined) url += `&status=${status}`;
    if (_page) url += `&_page=${_page}`;
    if (_limit) url += `&_limit=${_limit}`;

    url = url.replace(`${apiUrl}&`, `${apiUrl}?`);

    // Return
    return axiosClient.get(url);
  },

  fetch(metaTitle) {
    let url = `${apiUrl}/${metaTitle}`;

    return axiosClient.get(url);
  },

  add(params) {
    return axiosClient.post(apiUrl, params);
  },

  update(params) {
    const url = `${apiUrl}/${params._id}`;

    return axiosClient.put(url, params);
  },

  remove(id) {
    const url = `${apiUrl}/${id}`;

    return axiosClient.delete(url);
  },
};

export default categoryApi;
