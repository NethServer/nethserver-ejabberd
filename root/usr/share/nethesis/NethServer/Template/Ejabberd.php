<?php

echo $view->header()->setAttribute('template', $T('Ejabberd_Title'));

//Retrieve the ejabberd URL
$host = explode(':',$_SERVER['HTTP_HOST']);
$url = htmlspecialchars("https://$host[0]:5280/admin/");

$webUI = $view->fieldset()->setAttribute('template', $T('UsersMustBePartOfJabberadmins'))
         ->insert($view->literal(htmlspecialchars($T('Ejabberd_URL')) . ": <a href='$url' target='_blank'>ejabberd</a><br/>"));

echo $view->panel()
    ->insert($view->fieldsetSwitch('status', 'enabled', $view::FIELDSETSWITCH_CHECKBOX | $view::FIELDSETSWITCH_EXPANDABLE)->setAttribute('uncheckedValue', 'disabled')

        ->insert($view->fieldsetSwitch('WebAdmin', 'enabled', $view::FIELDSETSWITCH_CHECKBOX | $view::FIELDSETSWITCH_EXPANDABLE)->setAttribute('uncheckedValue', 'disabled')
            ->insert($webUI)
        )
        ->insert($view->fieldset(NULL, $view::FIELDSET_EXPANDABLE)->setAttribute('template', $T('Advanced_label'))
            ->insert($view->elementList()
                ->insert($view->checkbox('S2S', 'enabled')->setAttribute('uncheckedValue', 'disabled'))
                ->insert($view->textInput('ShaperFast'))
                ->insert($view->textInput('ShaperNormal'))

            )
        )

        ->insert($view->fieldset(NULL, $view::FIELDSET_EXPANDABLE)->setAttribute('template', $T('Modules_label'))
            ->insert($view->elementList()
                ->insert($view->fieldsetSwitch('ModMamStatus', 'enabled', $view::FIELDSETSWITCH_CHECKBOX | $view::FIELDSETSWITCH_EXPANDABLE)->setAttribute('uncheckedValue', 'disabled')
                    ->insert($view->fieldsetSwitch('ModMamPurgeDBStatus', 'enabled', $view::FIELDSETSWITCH_CHECKBOX | $view::FIELDSETSWITCH_EXPANDABLE)->setAttribute('uncheckedValue', 'disabled')
                         ->insert($view->textInput('ModMamPurgeDBInterval'))
                    )
                )
            )
        )
);
echo $view->buttonList($view::BUTTON_SUBMIT | $view::BUTTON_HELP);
?>
