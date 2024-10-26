import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Col, Button, Alert } from "react-bootstrap";
import { updatePost, createPost } from "../API";
import React from "react";

const PostForm = ({ post, resetSelectedPost }) => {
    //useState to populate form fields if a post was selected for update
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [userId, setUserId] = useState('');
    
    const queryClient = useQueryClient();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setUserId(post.userId);
            setBody(post.body);
        } else{
            setTitle('');
            setBody('');
            setUserId('');
        }
    }, [post]);

    const { mutate, isLoading, isError, error } = useMutation({
        mutationFn: post ? updatePost : createPost,
        onSuccess: (data) => {
            setShowSuccessAlert(true);
            if (post) {
                console.log('Post updated successfully');
                queryClient.setQueryData(['posts'], (existingPosts) => {
                    return existingPosts.map((post) => (post.id === data.id ? data : post));
                })
            } else {
                console.log('Post created with ID:', data.id);
                queryClient.setQueryData(['posts'], (existingPosts) => [...existingPosts, data]);
            }
            //queryClient.invalidateQueries(['posts']);
            setTimeout(() => setShowSuccessAlert(false), 1000);
            setBody('');
            setTitle('');
            setUserId('');
            setTimeout(() => resetSelectedPost(), 1000);
        },
    });

    const newPost = useMemo(() => ({
        id: post?.id,
        userId: userId,
        title: title,
        body: body
    }), [post, userId, title, body]);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        mutate(newPost);
    }, [newPost, mutate]);

    return (
        <div>
            {isError && <Alert variant="danger">An error occurred: {error.message}</Alert>}
            {showSuccessAlert && <Alert variant="success">Post successfully {post ? 'updated' : 'created'}</Alert>}
            <Col className="m-2 md-6">
                <Form onSubmit={handleSubmit} className="border p-3 rounded-4 border-dark">
                    <h3>Post Form</h3>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter Title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="userid">
                        <Form.Label>UserID</Form.Label>
                        <Form.Control type="number" placeholder="Enter UserID" name="userid" value={userId} onChange={(e) => setUserId(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label>Body</Form.Label>
                        <Form.Control name="body" as="textarea" rows={3} value={body} onChange={(e) => setBody(e.target.value)} required />
                    </Form.Group>
                    {post && <Button variant="primary" type="submit" disabled={isLoading}>{isLoading ? 'Updating...' : 'Update Post'}</Button>}
                    {!post && <Button variant="primary" type="submit" disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Post'}</Button>}
                </Form>
            </Col>
        </div>
    );
}

export default PostForm