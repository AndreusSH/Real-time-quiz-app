import { useEffect, useState } from 'react'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:8000/', {
  transports: ['websocket', 'polling']
})

const TrackParticipants = () => {
  //const [numParticipants, setNumParticipants] = useState(0)
  const [winner, setWinner] = useState('')

  useEffect(() => {
    console.log('socket', socket)
    // Listen for the "participants" event from the server
    socket.emit('participants', { p: 'Somebody asked how many participants' })

    {/*}
    socket.on('p', nParticipants => {
      console.log('nParticipants', nParticipants)
      setNumParticipants(nParticipants)
    })
  */}

    socket.on('winner', winnerId => {
      console.log('and the winner is: ', winnerId)
      setWinner(winnerId)
    })

    // Clean up event listener on component unmount
    return () => {
      socket.off('p')
      socket.off('winner')
    }
  }, [])

  return (
    <>
      {winner ? <p>The winner is: {winner}</p> : null}
      {/*<h1>There are {numParticipants} clients connected at the moment</h1>*/}
    </>
  )
}

export default TrackParticipants
