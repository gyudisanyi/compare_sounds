async function generalFetch(endpoint, method, bodyData = undefined) {
  const requestOptions = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  if (endpoint !== 'login' && endpoint !== 'users') {
    const token = localStorage.getItem('token');
    requestOptions.headers.Authorization = `Bearer ${token}`;
  }

  if (bodyData !== undefined) { requestOptions.body = JSON.stringify(bodyData); }

  const httpResponse = await fetch(`${process.env.REACT_APP_API_URL+endpoint}`, requestOptions);
  const response = await httpResponse.json();
  const { status } = httpResponse;
  const { message } = response;

  if (endpoint === 'login') {
    return response;
  }

  if (endpoint === 'sets' && method === 'GET') {
    return response;
  }

  if (httpResponse.ok) {
    const { data } = response;
    return { data, message, status };
  }
  return { message, status };
}
export default generalFetch;
