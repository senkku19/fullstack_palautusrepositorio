import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { expect } from "vitest";

test('renders title, but not likes or url', () => {
    const blog = {
        title: 'Testing title rendering',
        author: 'Teppo testi',
        url:"www.testi.fi",
        user: {},

    }

    const { container } = render(<Blog blog={blog}/>)

    const title = container.querySelector('title')
    expect(title).toBeDefined()
    const likes = container.querySelector('likes')
    const url = container.querySelector('url')
    expect(likes).toStrictEqual(null)
    expect(url).toStrictEqual(null)
})

test('renders url, likes and author, when clicking the view button', async () => {
    const blog = {
        title: 'Testing title rendering',
        author: 'Teppo testi',
        url:"www.testi.fi",
        user: {},
    }

    let { container } = render(<Blog blog={blog}/>)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likes = container.querySelector('likes')
    const url = container.querySelector('url')
    const author = container.querySelector('author')
    expect(likes).toBeDefined()
    expect(url).toBeDefined()
    expect(author).toBeDefined()
})

test('clicking the likes button twice calls event handler twice', async () => {
    const blog = {
        title: 'Testing title rendering',
        author: 'Teppo testi',
        url:"www.testi.fi",
        user: {},
    }

    const mockHandler = vi.fn()

    render(
        <Blog blog={blog} handleLikes={mockHandler}/>
    )

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likes = screen.getByText('like')
    await user.click(likes)
    await user.click(likes)

    expect(mockHandler.mock.calls).toHaveLength(2)
})