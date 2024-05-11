import { useEffect } from "react"


export default function Home() {

    useEffect(() => {
        fetch('http://localhost:6900/api/get_data')
          .then(response => response.json())
          .then(data => console.log(data))
      }, [])

    return (
        <p>Hi</p>
    )
}