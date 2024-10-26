const jsonApiUrl = 'https://jsonplaceholder.typicode.com';

export const fetchPosts = async () => {
    const response = await fetch(`${jsonApiUrl}/posts`);
    if (!response.ok) {
        throw new Error('Network response was not good');
    }
    return response.json();
};

export const createPost = async (post) => {
    const response = await fetch(`${jsonApiUrl}/posts`, {
        method: 'POST',
        body: JSON.stringify(post),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to add post');
    }
    return response.json();
};

export const updatePost = async (post) => {
    const response = await fetch(`${jsonApiUrl}/posts/${post.id}`, {
        method: 'PUT',
        body: JSON.stringify(post),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to update post');
    }
    return response.json();
};

export const deletePost = async (postId) => {
    const response = await fetch(`${jsonApiUrl}/posts/${postId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete post');
    }
    return response.json();
};