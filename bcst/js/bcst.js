
function assign_order(issue) {
    if (!is_labeled(issue, "approved")) return 7;

    if (is_labeled(issue, "safety")) return 1;
    if (is_labeled(issue, "tested_passed")) return 2;
    if (is_labeled(issue, "completed")) return 3;
    if (is_labeled(issue, "priority")) return 4;
    if (is_labeled(issue, "training")) {
        if (!is_labeled(issue, "workaround")) {
            return 5;
        } else {
            return 6;
        }
    }
    return 8;
}
function issue_cmp(i1, i2) {
    var o1 = assign_order(i1);
    var o2 = assign_order(i2);
    if (o1 < o2) return -1;
    if (o1 > o2) return 1;
    if (i1.number < i2.number) return -1;
    if (i1.number > i2.number) return 1;
    return 0;
}

function get_labels(issue) {
    var labels = "";
    for (var i=0; i<issue.labels.length; i++) {
        labels += issue.labels[i].name+" ";
    }
    return labels.trim();
}

function is_labeled(issue, target_label) {
    for (var i=0; i<issue.labels.length; i++) {
        var label = issue.labels[i];
        if (label.name == target_label) {
            return true;
        }
    }
    return false;
}

function created_at_cmp(o1, o2) {
    d1 = new Date(o1.created_at);
    d2 = new Date(o2.created_at);
    if (d1 < d2) return -1;
    if (d1 > d2) return 1;
    return 0;
}

function combine_comments_and_events(comments, events) {
    var ce = comments.concat(events);
    ce.sort(created_at_cmp);
    return ce;
}

function get_severity_num(issue) {
    if (is_labeled(issue, 'safety')) {
        return 1;
    }
    if (is_labeled(issue, 'training') && ! is_labeled(issue, 'workaround')) {
        return 2;
    }
    if (is_labeled(issue, 'training')) {
        return 3;
    }
    if (is_labeled(issue, 'enhancement')) {
        return 5;
    }
    return 4;
}

function get_severity(issue) {
    if (is_labeled(issue, 'safety')) {
        return "1 - Safety of Flight"
    }
    if (is_labeled(issue, 'training') && ! is_labeled(issue, 'workaround')) {
        return "2 - Training Impact - No Work Around"
    }
    if (is_labeled(issue, 'training')) {
        return "3 - Training Impact - Work Around"
    }
    if (is_labeled(issue, 'enhancement')) {
        return "5 - Enhancement"
    }
    return "4 - Defect - No Training Impact"
}

function get_status(issue) {
    if (is_labeled(issue, 'tested_passed')) {
        return "Tested Passed"
    }
    if (!is_labeled(issue, 'approved')) {
        return "Suspended"
    }
    if (is_labeled(issue, 'completed')) {
        return "Completed"
    }
    return "In Work"
}
