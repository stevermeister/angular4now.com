<?php

    // Only process POST reqeusts.
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Get the form fields and remove whitespace.
        $name = strip_tags(trim($_POST["name"]));
				$name = str_replace(array("\r","\n"),array(" "," "),$name);
        $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
        $message = trim($_POST["message"]);

        // Check that data was sent to the mailer.
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            // Set a 400 (bad request) response code and exit.
            $array['valid'] = 0;
            $array['message'] = 'Insert a valid email address!';
            echo json_encode($array);
            die();
        }

        if (preg_match('/^(127\.|192\.168\.)/', $_SERVER['REMOTE_ADDR'])) {
            $array['valid'] = 0;
            $array['message'] = 'Contact form will not work locally!';
            echo json_encode($array);
            die();
        }

        // ================================================================================
        // =================== Update this to your desired email address. =================
        // ================================================================================
        $recipient = "cear@cear-studio.zzz.com.ua";

        // Set the email subject.
        $subject = "New contact from $name";

        // Build the email content.
        $email_content = "Name: $name\n";
        $email_content .= "Email: $email\n\n";
        $email_content .= "Message:\n$message\n";

        // Build the email headers.
        $email_headers = "From: $name <$email>";

        if ( empty($recipient) || $recipient === "hello@example.com" ) {
            $array['valid'] = 0;
            $array['message'] = 'There is no recipients!';
            echo json_encode($array);
            die();
        }

        // Send the email.
        if (mail($recipient, $subject, $email_content, $email_headers)) {
            // Set a 200 (okay) response code.
            $array['valid'] = 1;
            $array['message'] = 'Thank You! Your message has been sent.';
            echo json_encode($array);
            die();
        } else {
            // Set a 500 (internal server error) response code.
            $array['valid'] = 0;
            $array['message'] = "Oops! We couldn't send your message.";
            echo json_encode($array);
            die();
        }

    } else {
        // Not a POST request, set a 403 (forbidden) response code.
        $array['valid'] = 0;
        $array['message'] = "There was a problem with your submission, please try again.";
        echo json_encode($array);
        die();
    }

?>