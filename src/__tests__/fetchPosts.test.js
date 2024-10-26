import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import PostList from '../components/PostList';
import { fetchPosts } from "../API";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

//Mock fetchPosts from the API.js
jest.mock('../API', () => ({
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

describe('fetchPosts Function', () => {
    test('fetch data from API on page load', async () => {
        const mockResponse = [
            { id: 1, title: 'Test Title 1', body: 'Post body 1', userId: 1 },
            { id: 2, title: 'Test Title 2', body: 'Post body 2', userId: 2 },
        ];
        fetchPosts.mockResolvedValue(mockResponse);

         const { asFragment } = renderUseQueryClient(<PostList onPostClick={jest.fn()} />)

        await waitFor(() => {
            mockResponse.forEach(post => {
                expect(screen.getByText(post.title)).toBeInTheDocument();
                expect(screen.getByText(post.body)).toBeInTheDocument();
            });
        });

        expect(fetchPosts).toHaveBeenCalledTimes(1);
        expect(asFragment()).toMatchSnapshot();
    });
});



