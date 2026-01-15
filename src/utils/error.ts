// TODO: error handling
export function errorHandling(message: string): void {

    let statusCode = message.split("-")[0].trim();
    
    switch (statusCode) {
        case "401":
            break;

        case "403":
            break;

        case "400":
            break;
    }


}