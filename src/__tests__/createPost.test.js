import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import PostForm from '../components/PostForm';
import { createPost, fetchPosts } from "../API";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostList from "../components/PostList";

//Mock CreatePost from the API.js
jest.mock('../API', () => ({
    createPost: jest.fn(),
    fetchPosts: jest.fn()
}));

const queryClient = new QueryClient();
const renderUsingClient = (ui) => {
    return render(
    <QueryClientProvider client={queryClient}>
        {ui}
    </QueryClientProvider>
    );
};

describe('createPost Function', () => {
    test('submit form and calls createPost from API', async () => {
        const mockPost = [{ id: 1, title: 'Mock Post', body: 'Mock Body', userId: 1 }];
        const newPost = { id: 2, title: 'Created Post', body: 'Created body', userId: 2};

        //simulate initial post
        fetchPosts.mockResolvedValue(mockPost);
        //simulate adding post
        createPost.mockResolvedValue(newPost);

        const { asFragment } = renderUsingClient(
            <>
                <PostForm />
                <PostList onPostClick={jest.fn()} />
            </>
        );

        fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Created Post'}});
        fireEvent.change(screen.getByLabelText(/UserID/i), { target: { value: '2'}});
        fireEvent.change(screen.getByLabelText(/Body/i), { target: { value: 'Created body'}});
        //Simulate adding the Post via Add Post button
        fireEvent.click(screen.getByText(/Add Post/i));
        
        //Ensure UI was updated correctly
        await waitFor(() => {
            expect(screen.getByText('Created Post')).toBeInTheDocument();
            expect(screen.getByText('Created body')).toBeInTheDocument();
        });
        //Confirm createPost was called
        expect(createPost).toHaveBeenCalledWith({
            title: 'Created Post',
            userId: '2',
            body: 'Created body'
        });

        //Test Snapshot
        expect(asFragment()).toMatchSnapshot();
    });  
});