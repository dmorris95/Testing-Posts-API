import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import PostList from '../components/PostList';
import { deletePost, fetchPosts } from "../API";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

//Mock fetchPosts from the API.js
jest.mock('../API', () => ({
    deletePost: jest.fn(),
    fetchPosts: jest.fn()
}));
const queryClient = new QueryClient();
const renderUseQueryClient = (ui) => {
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    );
};

describe('deletePost Function', () => {
    test('deleting a post via the delete button', async () => {
        const mockPosts = [
            { id: 1, title: 'Test Title 1', body: 'Post body 1', userId: 1 },
            { id: 2, title: 'Test Title 2', body: 'Post body 2', userId: 2 },
        ];

        //Simulates initial call
        fetchPosts.mockResolvedValue(mockPosts);

        //Simulate the delete call
        deletePost.mockResolvedValue({});

        const { asFragment } = renderUseQueryClient(
            <>
                <PostList onPostClick={jest.fn()} />
            </>
        );
        //First waitFor ensures posts are initialized
        await waitFor(() => {
            expect(screen.getByText('Test Title 1')).toBeInTheDocument();
            expect(screen.getByText('Test Title 2')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('del-button-1'));

        //Second waitFor ensures the post was removed from the UI correctly
        await waitFor(() => {
            //QueryBy to search the document
            expect(screen.queryByText('Test Title 1')).not.toBeInTheDocument();
            expect(screen.getByText('Test Title 2')).toBeInTheDocument();
        });

        expect(deletePost).toHaveBeenCalledWith(1);
        expect(asFragment()).toMatchSnapshot();
    });
})