const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: "Testi Teppo",
                username: "tteppo",
                password: "salasana"
            }
        })

        await page.goto('')
    })

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByRole('heading', {name: 'Login'})).toBeVisible()
        await expect(page.getByText('username', {exact: true})).toBeVisible()
        await expect(page.getByText('password', {exact: true})).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'tteppo', 'salasana')

            await expect(await page.getByText('Testi Teppo logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'tteppo', 'vaarasalasana')

            const errorDiv = await page.locator('.errorRed')
            await expect(errorDiv).toContainText('wrong username or password')
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'tteppo', 'salasana')
        })

        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'new blog' }).click()

            const blog = {
                title: 'Testataan uuden blogin luomista',
                author: 'Teppo testi',
                url: 'www.testi.fi'
            }
            await createBlog(page, blog)
            await expect(page.getByText('a new blog Testataan uuden blogin luomista by Teppo testi has been added')).toBeVisible()

        })

        test('a blog can be liked', async ({ page }) => {
            await page.getByRole('button', { name: 'new blog' }).click()
           
            const blog = {
                title: 'Testataan uuden blogin luomista',
                author: 'Teppo testi',
                url: 'www.testi.fi'
            }
            await createBlog(page, blog)

            await page.getByText('a new blog Testataan uuden blogin luomista by Teppo testi has been added').waitFor()

            await page.getByRole('button', { name: 'view' }).click()
            await page.getByRole('button', { name: 'like' }).click()
            await expect(page.getByText('likes 1')).toBeVisible()
        })

        test('a user that added the blog can delete it', async ({ page }) => {
            await page.getByRole('button', { name: 'new blog' }).click()

            const blog = {
                title: 'Testataan uuden blogin luomista',
                author: 'Teppo testi',
                url: 'www.testi.fi'
            }
            await createBlog(page, blog)

            await page.getByText('a new blog Testataan uuden blogin luomista by Teppo testi has been added').waitFor()

            await page.getByRole('button', { name: 'view' }).click()
            await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
            page.on('dialog', async (dialog) => {
                await dialog.accept()
              })
            await page.getByRole('button', { name: 'remove' }).click()
            await expect(page.getByText('Testataan uuden blogin luomista was deleted.')).toBeVisible()
        })

        test('only the user who added the blog can see it', async ({ page }) => {
            await page.getByRole('button', { name: 'new blog' }).click()
            
            const blog = {
                title: 'Testataan uuden blogin luomista',
                author: 'Teppo testi',
                url: 'www.testi.fi'
            }
            await createBlog(page, blog)

            await page.getByText('a new blog Testataan uuden blogin luomista by Teppo testi has been added').waitFor()

            await page.getByRole('button', { name: 'log out' }).click()

            await loginWith(page, 'tteppo', 'salasana')

            await page.getByRole('button', { name: 'view' }).click()
            await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
        })

        test('blogs should be orginized by the amount of likes', async ({ page }) => {
            const blogs = [
                {
                    title: 'blog1',
                    author: 'Teppo testi',
                    url: 'www.testi.fi',
                    likes: 1
                },
                {
                    title: 'blog2',
                    author: 'Teppo testi',
                    url: 'www.testi.fi',
                    likes: 0
                }, 
                {
                    title: 'blog3',
                    author: 'Teppo testi',
                    url: 'www.testi.fi',
                    likes: 3
                }
            ]

            for (const blog of blogs) {
                await page.getByRole('button', { name: 'new blog' }).click()

                await createBlog(page, blog)
              
                await page.getByText(`${blog.title}`).first().waitFor()
              
                const blogHelper = page.locator('.title').filter({ hasText: blog.title })


                if (blog.likes > 0) {
                    await blogHelper.getByRole('button', { name: 'view' }).click()
                    for (let count = 0; count < blog.likes; count++) {
                        await page.getByRole('button', { name: 'like' }).click()
                    }

                    await page.getByRole('button', { name: 'hide' }).click()
                }
                
              }
              

              const titles = page.locator('.title')

              await expect(titles.nth(0)).toContainText('blog3view')
              await expect(titles.nth(1)).toContainText('blog1view')
              await expect(titles.nth(2)).toContainText('blog2view')    
        })
    })
})