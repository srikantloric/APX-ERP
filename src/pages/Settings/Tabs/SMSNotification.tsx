import { Box, Card, CardContent, FormControl, FormHelperText, FormLabel, Skeleton, Switch } from "@mui/joy";
import { db } from "../../../firebase";
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";

function SMSNotification() {
    const [notifications, setNotifications] = useState({
        sendFeePaymentNotification: false,
        sendFeeDefaulterNotification: false,
        sendAttendanceNotification: false
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);
        db.collection("CONFIG").doc("SMS_CONFIG").get().then((doc) => {
            const data = doc.data();
            if (data) {
                setNotifications({
                    sendFeePaymentNotification: data.sendFeePaymentNotification || false,
                    sendFeeDefaulterNotification: data.sendFeeDefaulterNotification || false,
                    sendAttendanceNotification: data.sendAttendanceNotification || false
                });
            }
            setIsLoading(false);
        }).catch((err) => {
            console.error(err);
            enqueueSnackbar("Error fetching data: " + err.message, { variant: "error" });
            setIsLoading(false);
        });
    }, []);

    const handleSwitchChange = (field: string, value: boolean) => {
        setNotifications(prev => ({ ...prev, [field]: value }));

        db.collection("CONFIG").doc("SMS_CONFIG").update({
            [field]: value
        }).then(() => {
            enqueueSnackbar("Settings updated successfully!", { variant: "success" });
        }).catch((err) => {
            console.error(err);
            enqueueSnackbar("Error updating data: " + err.message, { variant: "error" });
        });
    };

    const renderNotificationControl = (label: string, description: string, field: keyof typeof notifications) => (
        <Card key={field}>
            <CardContent sx={{ width: "100%" }}>
                {isLoading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: 300,
                        }}
                    >
                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="rectangular" width="70%" height={24} sx={{ mb: 1 }} />
                            <Skeleton variant="rectangular" width="90%" height={16} sx={{ mb: 1 }} />
                        </Box>
                        <Skeleton variant="rectangular" width={48} height={32} />
                    </Box>
                ) : (
                    <FormControl orientation="horizontal" sx={{ width: "100%", justifyContent: 'space-between', gap: 2 }}>
                        <div>
                            <FormLabel>{label}</FormLabel>
                            <FormHelperText sx={{ mt: 0 }}>{description}</FormHelperText>
                        </div>
                        <Switch
                            checked={notifications[field]}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSwitchChange(field, event.target.checked)}
                            color={notifications[field] ? 'success' : 'neutral'}
                            variant={notifications[field] ? 'solid' : 'outlined'}
                            endDecorator={notifications[field] ? 'On' : 'Off'}
                            slotProps={{
                                endDecorator: {
                                    sx: { minWidth: 24 },
                                },
                            }}
                        />
                    </FormControl>
                )}
            </CardContent>
        </Card>
    );

    return (
        <Box
            sx={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                gap: 2,
            }}
        >
            {renderNotificationControl("Payment Notification", "Send SMS notification to parents phone on fee collection.", "sendFeePaymentNotification")}
            {renderNotificationControl("Fee Defaulter Notification", "Send SMS notification to parents phone for fee defaulter.", "sendFeeDefaulterNotification")}
            {renderNotificationControl("Attendance Notification", "Send SMS notification to parents phone for attendance.", "sendAttendanceNotification")}
        </Box>
    );
}

export default SMSNotification;
