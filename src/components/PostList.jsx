import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { Card, Button, Spinner, Alert, Form } from "react-bootstrap";
import { fetchPosts, deletePost } from "../API";
import React from "react";

const PostList = ({ onPostClick }) => {
    const queryClient = useQueryClient();
    const [filterId, setFilterId] = useState('');

    const { data, isLoading, isSuccess, error } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 5 * 60 * 1000, 
        cacheTime: 15 * 60 * 1000
    });

    const delPost = useMutation({
        mutationFn: deletePost,
        onSuccess: (data, postId) => {
            console.log('Post deleted successfully')
            queryClient.setQueryData(['posts'], (existingPosts) => {
                return existingPosts.filter(post => post.id !== postId);
            });
        },
    });

    //Post Memoization
    const filterPosts = useMemo(() => {
        //Data check in case an undefined value is returned from the API call
        return data ? data.filter(post => post.userId.toString().includes(filterId)) : [];
    }, [data, filterId]);

    //Memoize the postClick (The UserSelect in this program)
    const handlePostClick = useCallback((post) => {
        onPostClick(post);
    }, [onPostClick]);


    if (isLoading) return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
    if (error) return <Alert variant="danger">Error fetching data</Alert>;

    return (
        <div>
            <input className="mb-3 bg-light border-primary rounded-2" name="filterId" type="number" value={filterId} placeholder="Filter by User ID" onChange={(e) => setFilterId(e.target.value)}/>
            {isSuccess && filterPosts.map(post => (
                <Card key={post.id} className="mb-3">
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.body}</Card.Text>
                        <Button variant="primary" onClick={() => handlePostClick(post)}>Edit</Button>
                        <Button 
                            variant="danger" 
                            data-testid={`del-button-${post.id}`} 
                            onClick={() => delPost.mutate(post.id)}
                        >
                        Delete
                        </Button>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
}

export default PostList