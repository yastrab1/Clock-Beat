'use server'
export async function searchYoutube(videoName:string){
    const apiKey = process.env.SERPAPI_API_KEY || '';
    const results = await fetch(`https://serpapi.com/search?api_key=${apiKey}&engine=youtube&q=${videoName}`)
    const resultsJson = await results.json()
    const firstResult = resultsJson["video_results"][0]
    return {url:firstResult["link"], title:firstResult["title"]}
}