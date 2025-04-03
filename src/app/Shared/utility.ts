export class Utility {
    updateApiKey(apikey: string): void {
        
        if(apikey!=null && apikey!=undefined)
        localStorage.setItem('apikey', apikey);
    }
}
