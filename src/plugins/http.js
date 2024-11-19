import request from '@/plugins/request'

function makeRequest(method, path,params = null, data = null) {
    return request({
        url: path,
        method: method,
        ...(params && { params }), // 仅在query不为null时添加params属性
        ...(data && { data }) // 仅在data不为null时添加data属性
    }).catch(error => {
        console.error(`Error during ${method} request to ${path}:`, error);
        throw error; // 重新抛出错误以便调用者处理
    });
}

export const Get = (path, query) => makeRequest('get', path, query,null );
export const Post = (path, data) => makeRequest('post', path,null, data);
export const Put = (path, data) => makeRequest('put', path,null, data);
export const Delete  = path => makeRequest('delete', path);
