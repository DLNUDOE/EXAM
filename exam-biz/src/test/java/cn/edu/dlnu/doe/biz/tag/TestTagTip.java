package cn.edu.dlnu.doe.biz.tag;

import org.junit.Test;
import org.nutz.lang.Files;

import java.io.*;
import java.util.Scanner;

/**
 * Created with IntelliJ IDEA.
 * User: upupxjg
 * Date: 13-3-13
 * Time: 下午12:37
 */
public class TestTagTip {

    public static void main(String[] args) throws IOException {
        TagTip tagTip = new TagTip();
        File data = Files.findFile("data.txt");
        BufferedReader br = new BufferedReader(new FileReader(data));
        String line = br.readLine();
        while (line != null) {
            line = line.trim();
            String[] tags = line.split(",");
            for (String tag : tags) {
                if (!tag.trim().isEmpty())
                    tagTip.addToSet(tag);
            }
            line = br.readLine();
        }
        Scanner scanner = new Scanner(System.in);
        String target = scanner.nextLine();
        while (!target.equals("Q")) {
            for (String s : tagTip.search(target)) {
                System.out.println(s);
            }
            target = scanner.nextLine();
        }
    }
}
