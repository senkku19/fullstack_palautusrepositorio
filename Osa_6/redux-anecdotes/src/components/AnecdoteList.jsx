import { useSelector, useDispatch } from 'react-redux'

import { newVote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state)
    const dispatch = useDispatch()

    return(
        <>
            {anecdotes.map(anecdote =>
            <div key={anecdote.id}>
                <div>
                    {anecdote.content}
                </div>
                <div>
                    has {anecdote.votes}
                    <button onClick={() => dispatch(newVote(anecdote.id))}>vote</button>
                </div>
            </div>
            )}
        </>
    )

}

export default AnecdoteList