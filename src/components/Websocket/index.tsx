import React from 'react';
// // import { TypeNotificationFSocket } from 'src/types/notification-types';
// import { useSignInContext } from 'src/context/SignInContext';
// import { useSnackbar } from 'notistack';
// import SnackMessage from '../SnackMessage';
// import { useNotificationContext } from 'src/context/NotificationContext';

export interface ComponentProps {}
const WebSocketContainer: React.FC<ComponentProps> = (): JSX.Element => {
    // const [signInDlgState] = useSignInContext();
    // const [notificationState, setNotificationState] = useNotificationContext();
    // const { enqueueSnackbar } = useSnackbar();
    // const clientRef: any = useRef(null);
    // const [waitingToReconnect, setWaitingToReconnect] = useState<boolean>(false);
    // const [messages, setMessages] = useState<Array<TypeNotificationFSocket>>([]);
    // const [isOpen, setIsOpen] = useState(false);

    // const showNotificationSnackBar = (title: string, context: string) => {
    //     enqueueSnackbar('', {
    //         anchorOrigin: { horizontal: 'right', vertical: 'top' },
    //         autoHideDuration: 3000,
    //         content: (key) => <SnackMessage id={key} title={title} message={context} variant="info" isMarkup={true} />,
    //     });
    // };

    // const addMessage = (message: TypeNotificationFSocket) => {
    //     setMessages([...messages, message]);
    // };

    // useEffect(() => {
    //     if (waitingToReconnect) {
    //         return;
    //     }
    //     // Only set up the websocket once
    //     // if (!clientRef.current) {
    //     //     const client = new WebSocket(serverConfig.socketServiceUrl || '');
    //     //     clientRef.current = client;
    //     //     window.client = client;
    //     //
    //     //     client.onerror = (e) => console.error(e);
    //     //     client.onopen = () => {
    //     //         // setIsOpen(true);
    //     //         console.log('ws opened');
    //     //         client.send('ping');
    //     //     };
    //     //     client.onclose = () => {
    //     //         if (clientRef.current) {
    //     //             // Connection failed
    //     //             console.log('ws closed by server');
    //     //         } else {
    //     //             // Cleanup initiated from app side, can return here, to not attempt a reconnect
    //     //             console.log('ws closed by app component unmount');
    //     //             return;
    //     //         }
    //     //         if (waitingToReconnect) {
    //     //             return;
    //     //         }
    //     //
    //     //         // Parse event code and log
    //     //         // setIsOpen(false);
    //     //         console.log('ws closed');
    //     //
    //     //         // Setting this will trigger a re-run of the effect,
    //     //         // cleaning up the current websocket, but not setting
    //     //         // up a new one right away
    //     //         setWaitingToReconnect(true);
    //     //
    //     //         // This will trigger another re-run, and because it is false,
    //     //         // the socket will be set up again
    //     //         setTimeout(() => setWaitingToReconnect(false), 100);
    //     //     };
    //     //
    //     //     client.onmessage = (message: any) => {
    //     //         const msgData: TypeNotificationFSocket = JSON.parse(message.data);
    //     //         let userAddress = '';
    //     //         if (signInDlgState.walletAccounts.length !== 0) userAddress = signInDlgState.walletAccounts[0];
    //     //         // console.log('received message', msgData, msgData.type);
    //     //         if (msgData.type === 'alert') {
    //     //             const note: TypeNotificationFSocket = { ...msgData };
    //     //             if (note.to !== undefined && note.to === userAddress) {
    //     //                 showNotificationSnackBar(note.title || '', note.context || '');
    //     //                 setNotificationState({
    //     //                     ...notificationState,
    //     //                     notesUnreadCnt: notificationState.notesUnreadCnt + 1,
    //     //                 });
    //     //             }
    //     //         }
    //     //         // addMessage(`received '${message.data}'`);
    //     //     };
    //     //
    //     //     return () => {
    //     //         console.log('Cleanup');
    //     //         // Dereference, so it will set up next time
    //     //         clientRef.current = null;
    //     //         client.close();
    //     //     };
    //     // }
    // }, [waitingToReconnect]);

    return <></>;
};

export default WebSocketContainer;
