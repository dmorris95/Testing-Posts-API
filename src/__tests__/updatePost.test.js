import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import PostForm from '../components/PostForm';
import { updatePost, fetchPosts } from "../API";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostList from "../components/PostList";

//Mock updatePost and fetchPosts from the APi
jest.mock('../API', () => ({
    updatePost: jest.fn(),
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

describe('Update Post Functionality', () => {
    test('Update post and submit updated post via PostForm', async () => {
        const mockPosts = [
            { id: 1, title: 'Test Title 1', body: 'Post body 1', userId: 1 },
            { id: 2, title: 'Test Ttitle 2', body: 'Post body 2', userId: 2 },
        ]
        const updatedPost = { id: 1, title: 'Updated Title', body: 'Updated Body', userId: 1 };

        fetchPosts.mockResolvedValue(mockPosts);
        updatePost.mockResolvedValue(updatedPost);

        const { asFragment } = renderUsingClient(
            <>
                <PostForm post={mockPosts[0]} />
                <PostList onPostClick={jest.fn()} />
            </>
        );

        fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Updated Title' }});
        fireEvent.change(screen.getByLabelText(/Body/i), { target: { value: 'Updated Body'}});

        fireEvent.click(screen.getByText(/Update Post/i));

        await waitFor(() => {
            expect(screen.getByText('Updated Title')).toBeInTheDocument();
            expect(screen.getByText('Updated Body')).toBeInTheDocument();
        });

        //Test to see if updatePost was called properly
        expect(updatePost).toHaveBeenCalledWith({
            id: 1,
            title: 'Updated Title',
            userId: 1,
            body: 'Updated Body'
        });

        //Screenshot Test to ensure no unexepected changes
        expect(asFragment()).toMatchSnapshot();

    });
});